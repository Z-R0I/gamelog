import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { RawgService } from '../../core/services/rawg.service';
import { Game } from '../../core/models/game';
import { GameCard } from '../../shared/game-card/game-card';
import { InfiniteScrollDirective } from '../../shared/infinite-scroll/infinite-scroll.directive';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-home',
  imports: [GameCard, InfiniteScrollDirective],
  templateUrl: './home.html',
})
export class Home {
  private readonly rawg = inject(RawgService);

  protected readonly games = signal<Game[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly hasMore = signal(true);
  protected readonly error = signal<string | null>(null);

  private nextPage = 1;

  constructor() {
    this.loadMore();
  }

  protected loadMore(): void {
    if (this.isLoading() || !this.hasMore()) return;
    this.isLoading.set(true);
    this.error.set(null);

    this.rawg
      .getGames({ page: this.nextPage, pageSize: PAGE_SIZE })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.games.update((prev) => [...prev, ...res.results]);
          this.hasMore.set(res.next !== null);
          this.nextPage++;
        },
        error: () => this.error.set('Error al cargar más juegos.'),
      });
  }
}
