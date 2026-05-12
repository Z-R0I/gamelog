import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RawgService } from '../../core/services/rawg.service';
import { GameDetailContent } from './game-detail-content';
import { GameDetailSkeleton } from './game-detail-skeleton';

@Component({
  selector: 'app-game-detail',
  imports: [RouterLink, GameDetailContent, GameDetailSkeleton],
  templateUrl: './game-detail.html',
})
export class GameDetail {
  private readonly rawg = inject(RawgService);

  id = input.required<string>();

  private readonly numericId = computed(() => {
    const n = Number(this.id());
    return Number.isFinite(n) ? n : null;
  });

  protected readonly resource = this.rawg.gameByIdResource(() => this.numericId());
  protected readonly game = computed(() => this.resource.value());

  protected retry(): void {
    this.resource.reload();
  }
}
