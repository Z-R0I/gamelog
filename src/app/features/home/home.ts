import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Game } from '../../core/models/game';
import { RawgService } from '../../core/services/rawg.service';
import { GameCard } from '../../shared/game-card/game-card';
import { InfiniteScrollDirective } from '../../shared/infinite-scroll/infinite-scroll.directive';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll/reveal-on-scroll.directive';
import { HeroCarousel } from './hero-carousel/hero-carousel';

const HERO_COUNT = 5;
const SECTION_COUNT = 8;
const CATALOG_PAGE_SIZE = 20;

@Component({
  selector: 'app-home',
  imports: [
    GameCard,
    InfiniteScrollDirective,
    RevealOnScrollDirective,
    HeroCarousel,
  ],
  templateUrl: './home.html',
})
export class Home {
  private readonly rawg = inject(RawgService);

  protected readonly heroGames = signal<Game[]>([]);
  protected readonly heroLoading = signal(true);

  protected readonly topRated = signal<Game[]>([]);
  protected readonly topRatedLoading = signal(true);

  protected readonly recent = signal<Game[]>([]);
  protected readonly recentLoading = signal(true);

  protected readonly catalog = signal<Game[]>([]);
  protected readonly catalogLoading = signal(false);
  protected readonly catalogHasMore = signal(true);
  protected readonly catalogError = signal<string | null>(null);
  private catalogNextPage = 1;

  constructor() {
    this.loadHero();
    this.loadTopRated();
    this.loadRecent();
    this.loadCatalogMore();
  }

  private loadHero(): void {
    this.rawg
      .getGames({ pageSize: HERO_COUNT, ordering: '-rating' })
      .pipe(finalize(() => this.heroLoading.set(false)))
      .subscribe({
        next: (res) => this.heroGames.set(res.results),
      });
  }

  private loadTopRated(): void {
    const today = new Date();
    const threeYearsAgo = new Date(
      today.getFullYear() - 3,
      today.getMonth(),
      today.getDate(),
    );
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const dates = `${fmt(threeYearsAgo)},${fmt(today)}`;

    this.rawg
      .getGames({
        pageSize: SECTION_COUNT,
        ordering: '-metacritic',
        dates,
      })
      .pipe(finalize(() => this.topRatedLoading.set(false)))
      .subscribe({
        next: (res) => this.topRated.set(res.results),
      });
  }

  private loadRecent(): void {
    const today = new Date();
    const oneYearAgo = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate(),
    );
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const dates = `${fmt(oneYearAgo)},${fmt(today)}`;

    this.rawg
      .getGames({
        pageSize: SECTION_COUNT,
        ordering: '-released',
        dates,
      })
      .pipe(finalize(() => this.recentLoading.set(false)))
      .subscribe({
        next: (res) => this.recent.set(res.results),
      });
  }

  protected loadCatalogMore(): void {
    if (this.catalogLoading() || !this.catalogHasMore()) return;
    this.catalogLoading.set(true);
    this.catalogError.set(null);

    this.rawg
      .getGames({ page: this.catalogNextPage, pageSize: CATALOG_PAGE_SIZE })
      .pipe(finalize(() => this.catalogLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.catalog.update((prev) => [...prev, ...res.results]);
          this.catalogHasMore.set(res.next !== null);
          this.catalogNextPage++;
        },
        error: () => this.catalogError.set('Error al cargar más juegos.'),
      });
  }
}
