import { Component, inject, OnInit, signal } from '@angular/core';
import { RawgService } from '../../core/services/rawg.service';
import { Game } from '../../core/models/game';
import { GameCard } from '../../shared/game-card/game-card';

@Component({
  selector: 'app-home',
  imports: [GameCard],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private rawg = inject(RawgService);
  protected games = signal<Game[]>([]);

  ngOnInit(): void {
    this.rawg.getGames().subscribe((res) => this.games.set(res.results));
  }
}
