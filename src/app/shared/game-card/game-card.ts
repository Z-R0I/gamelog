import { Component, input } from '@angular/core';
import { Game } from '../../core/models/game';

@Component({
  selector: 'app-game-card',
  imports: [],
  templateUrl: './game-card.html',
})
export class GameCard {
  game = input.required<Game>();
}
