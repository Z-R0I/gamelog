import { Component, computed, inject, input } from '@angular/core';
import { Game } from '../../core/models/game';
import { FavoriteService } from '../../core/services/favorites.service';

@Component({
  selector: 'app-game-card',
  imports: [],
  templateUrl: './game-card.html',
})
export class GameCard {
  private favorites = inject(FavoriteService);

  game = input.required<Game>();

  isFavorite = computed(() => this.favorites.has(this.game().id));

  cardClasses = computed(() =>
    this.isFavorite()
      ? 'border-amber-400 shadow-lg shadow-amber-400/30'
      : 'border-zinc-800 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10',
  );

  starClasses = computed(() =>
    this.isFavorite()
      ? 'fill-amber-400 stroke-amber-400'
      : 'fill-transparent stroke-white',
  );

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favorites.toggle(this.game());
  }
}
