import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Game } from '../models/game';
import { RawgService } from './rawg.service';

const STORAGE_KEY = 'gamelog:favorites:v2';

type FavoriteCache = Record<number, Game>;

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly rawg = inject(RawgService);

  private readonly _cache = signal<FavoriteCache>(this.loadFromStorage());
  private readonly _isRefreshing = signal(false);

  readonly favoriteGames = computed<Game[]>(() => Object.values(this._cache()));
  readonly favoriteIds = computed<number[]>(() =>
    Object.keys(this._cache()).map(Number),
  );
  readonly count = computed(() => this.favoriteIds().length);
  readonly isEmpty = computed(() => this.count() === 0);
  readonly isRefreshing = this._isRefreshing.asReadonly();

  constructor() {
    effect(() => {
      const cache = this._cache();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
      } catch {
        // quota / disabled — ignore
      }
    });
  }

  has(id: number): boolean {
    return id in this._cache();
  }

  add(game: Game): void {
    if (this.has(game.id)) return;
    this._cache.update((cache) => ({ ...cache, [game.id]: game }));
  }

  remove(id: number): void {
    if (!this.has(id)) return;
    this._cache.update((cache) => {
      const next = { ...cache };
      delete next[id];
      return next;
    });
  }

  toggle(game: Game): void {
    this.has(game.id) ? this.remove(game.id) : this.add(game);
  }

  clear(): void {
    this._cache.set({});
  }

  refresh(): void {
    const ids = this.favoriteIds();
    if (ids.length === 0 || this._isRefreshing()) return;

    this._isRefreshing.set(true);

    forkJoin(
      ids.map((id) =>
        this.rawg.getGameById(id).pipe(catchError(() => of(null))),
      ),
    ).subscribe({
      next: (results) => {
        this._cache.update((cache) => {
          const next = { ...cache };
          for (const game of results) {
            if (game) next[game.id] = game;
          }
          return next;
        });
      },
      complete: () => this._isRefreshing.set(false),
      error: () => this._isRefreshing.set(false),
    });
  }

  private loadFromStorage(): FavoriteCache {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return {};
      }
      const result: FavoriteCache = {};
      for (const [key, value] of Object.entries(parsed)) {
        const id = Number(key);
        if (Number.isFinite(id) && this.isValidGame(value)) {
          result[id] = value as Game;
        }
      }
      return result;
    } catch {
      return {};
    }
  }

  private isValidGame(value: unknown): boolean {
    return (
      !!value &&
      typeof value === 'object' &&
      typeof (value as Game).id === 'number' &&
      typeof (value as Game).name === 'string'
    );
  }
}
