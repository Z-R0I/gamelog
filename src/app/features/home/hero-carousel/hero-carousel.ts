import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Game } from '../../../core/models/game';
import { GameDetailModalService } from '../../../core/services/game-detail-modal.service';

const AUTOPLAY_INTERVAL_MS = 6000;

@Component({
  selector: 'app-hero-carousel',
  imports: [DatePipe],
  templateUrl: './hero-carousel.html',
  styleUrl: './hero-carousel.css',
})
export class HeroCarousel {
  private readonly modal = inject(GameDetailModalService);

  games = input.required<Game[]>();

  protected readonly currentIndex = signal(0);
  protected readonly isPaused = signal(false);

  protected readonly slideCount = computed(() => this.games().length);

  constructor() {
    effect((onCleanup) => {
      if (this.isPaused() || this.slideCount() <= 1) return;
      const id = setInterval(() => this.next(), AUTOPLAY_INTERVAL_MS);
      onCleanup(() => clearInterval(id));
    });

    effect(() => {
      const count = this.slideCount();
      if (count > 0 && this.currentIndex() >= count) {
        this.currentIndex.set(0);
      }
    });
  }

  protected next(): void {
    const count = this.slideCount();
    if (count <= 1) return;
    this.currentIndex.update((i) => (i + 1) % count);
  }

  protected prev(): void {
    const count = this.slideCount();
    if (count <= 1) return;
    this.currentIndex.update((i) => (i - 1 + count) % count);
  }

  protected goTo(index: number): void {
    this.currentIndex.set(index);
  }

  protected pause(): void {
    this.isPaused.set(true);
  }

  protected resume(): void {
    this.isPaused.set(false);
  }

  protected openDetail(id: number): void {
    this.modal.open(id);
  }

  protected isActive(index: number): boolean {
    return this.currentIndex() === index;
  }
}
