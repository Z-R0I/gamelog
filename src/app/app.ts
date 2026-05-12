import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { GameDetailModal } from './shared/game-detail-modal/game-detail-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, GameDetailModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'gamelog';
}
