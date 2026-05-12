import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../core/services/favorites.service';
import { GameCard } from '../../shared/game-card/game-card';
import { StarIcon } from '../../shared/star-icon/star-icon';

@Component({
  selector: 'app-favorites',
  imports: [GameCard, RouterLink, StarIcon],
  templateUrl: './favorites.html',
})
export class Favorites {
  protected readonly favorites = inject(FavoriteService);

  constructor() {
    this.favorites.refresh();
  }
}
