import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Game } from '../../core/models/game';
import { FavoriteService } from '../../core/services/favorites.service';
import { GameDetailModalService } from '../../core/services/game-detail-modal.service';
import { SpotlightDirective } from '../spotlight/spotlight.directive';
import { StarIcon } from '../star-icon/star-icon';

@Component({
  selector: 'app-game-card',
  imports: [StarIcon, SpotlightDirective, DatePipe],
  templateUrl: './game-card.html',
})
export class GameCard {
  private readonly favorites = inject(FavoriteService);
  private readonly modal = inject(GameDetailModalService);

  game = input.required<Game>();

  protected readonly isFavorite = computed(() =>
    this.favorites.has(this.game().id),
  );

  protected readonly cardClasses = computed(() =>
    this.isFavorite()
      ? 'border-amber-400 shadow-lg shadow-amber-400/30'
      : 'border-zinc-800 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10',
  );

  protected openDetail(): void {
    this.modal.open(this.game().id);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openDetail();
    }
  }

  protected toggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favorites.toggle(this.game());
  }
}
