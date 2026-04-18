import { Component, inject, OnInit, signal } from '@angular/core';
import { RawgService } from '../../core/services/rawg.service';
import { Game } from '../../core/models/game';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private rawg = inject(RawgService);
  protected games = signal<Game[]>([]);

  ngOnInit(): void {
    this.rawg.getGames().subscribe((res) => this.games.set(res.results));
  }
}
