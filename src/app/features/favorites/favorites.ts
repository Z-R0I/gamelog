import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../core/services/favorites.service';
import { GameCard } from '../../shared/game-card/game-card';

@Component({
  selector: 'app-favorites',
  imports: [GameCard, RouterLink],
  templateUrl: './favorites.html',
})
export class Favorites implements OnInit {
  protected favorites = inject(FavoriteService);

  ngOnInit(): void {
    this.favorites.refresh();
  }
}
