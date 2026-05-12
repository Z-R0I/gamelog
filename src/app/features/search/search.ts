import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, of, startWith, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  tap,
} from 'rxjs/operators';
import { FilterOption, Game, GamesResponse } from '../../core/models/game';
import { RawgService } from '../../core/services/rawg.service';
import { GameCard } from '../../shared/game-card/game-card';
import { InfiniteScrollDirective } from '../../shared/infinite-scroll/infinite-scroll.directive';

const PAGE_SIZE = 20;
const DEBOUNCE_MS = 400;

type OrderingOption = { value: string; label: string };

const ORDERING_OPTIONS: OrderingOption[] = [
  { value: '', label: 'Relevancia' },
  { value: '-rating', label: 'Mejor valorados' },
  { value: '-metacritic', label: 'Top Metacritic' },
  { value: '-released', label: 'Más recientes' },
  { value: 'released', label: 'Más antiguos' },
  { value: 'name', label: 'Nombre (A-Z)' },
];

interface SearchFilters {
  search: string;
  genre: number | null;
  platform: number | null;
  ordering: string;
}

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, GameCard, InfiniteScrollDirective],
  templateUrl: './search.html',
})
export class Search {
  private readonly rawg = inject(RawgService);

  protected readonly form = new FormGroup({
    search: new FormControl<string>('', { nonNullable: true }),
    genre: new FormControl<number | null>(null),
    platform: new FormControl<number | null>(null),
    ordering: new FormControl<string>('', { nonNullable: true }),
  });

  protected readonly orderingOptions = ORDERING_OPTIONS;

  protected readonly genres = signal<FilterOption[]>([]);
  protected readonly platforms = signal<FilterOption[]>([]);

  protected readonly results = signal<Game[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly hasMore = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly totalCount = signal(0);

  private nextPage = 1;
  private currentFilters: SearchFilters = {
    search: '',
    genre: null,
    platform: null,
    ordering: '',
  };
  private readonly loadMore$ = new Subject<void>();

  constructor() {
    this.loadFilterOptions();
    this.wireSearch();
    this.wireLoadMore();
  }

  protected resetFilters(): void {
    this.form.reset({ search: '', genre: null, platform: null, ordering: '' });
  }

  protected loadMore(): void {
    if (this.isLoading() || !this.hasMore()) return;
    this.loadMore$.next();
  }

  private loadFilterOptions(): void {
    forkJoin({
      genres: this.rawg.getGenres().pipe(catchError(() => of([]))),
      platforms: this.rawg.getPlatforms().pipe(catchError(() => of([]))),
    })
      .pipe(takeUntilDestroyed())
      .subscribe(({ genres, platforms }) => {
        this.genres.set(genres);
        this.platforms.set(platforms);
      });
  }

  private wireSearch(): void {
    this.form.valueChanges
      .pipe(
        startWith(this.form.getRawValue()),
        debounceTime(DEBOUNCE_MS),
        distinctUntilChanged(
          (a, b) =>
            (a.search ?? '') === (b.search ?? '') &&
            (a.genre ?? null) === (b.genre ?? null) &&
            (a.platform ?? null) === (b.platform ?? null) &&
            (a.ordering ?? '') === (b.ordering ?? ''),
        ),
        tap((value) => {
          this.currentFilters = {
            search: (value.search ?? '').trim(),
            genre: value.genre ?? null,
            platform: value.platform ?? null,
            ordering: value.ordering ?? '',
          };
          this.results.set([]);
          this.error.set(null);
          this.totalCount.set(0);
          this.hasMore.set(false);
          this.nextPage = 1;
          this.isLoading.set(true);
        }),
        switchMap(() =>
          this.fetch(this.currentFilters, 1).pipe(
            catchError(() => {
              this.error.set('Error al buscar juegos.');
              return of<GamesResponse | null>(null);
            }),
            finalize(() => this.isLoading.set(false)),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        if (!res) return;
        this.results.set(res.results);
        this.totalCount.set(res.count);
        this.hasMore.set(res.next !== null);
        this.nextPage = 2;
      });
  }

  private wireLoadMore(): void {
    this.loadMore$
      .pipe(
        tap(() => {
          this.isLoading.set(true);
          this.error.set(null);
        }),
        switchMap(() =>
          this.fetch(this.currentFilters, this.nextPage).pipe(
            catchError(() => {
              this.error.set('Error al cargar más resultados.');
              return of<GamesResponse | null>(null);
            }),
            finalize(() => this.isLoading.set(false)),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        if (!res) return;
        this.results.update((prev) => [...prev, ...res.results]);
        this.hasMore.set(res.next !== null);
        this.nextPage++;
      });
  }

  private fetch(filters: SearchFilters, page: number) {
    return this.rawg.getGames({
      page,
      pageSize: PAGE_SIZE,
      search: filters.search || undefined,
      genres: filters.genre ?? undefined,
      parentPlatforms: filters.platform ?? undefined,
      ordering: filters.ordering || undefined,
    });
  }
}
