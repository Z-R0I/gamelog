import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Game } from '../../core/models/game';
import { FavoriteService } from '../../core/services/favorites.service';
import { resizeRawgImage } from '../../core/utils/rawg-image';
import { StarIcon } from '../../shared/star-icon/star-icon';

const DESCRIPTION_PREVIEW_THRESHOLD = 300;
const HERO_WIDTH = 1280;
const HERO_HEIGHT = 549;
const SCREENSHOT_WIDTH = 600;

@Component({
  selector: 'app-game-detail-content',
  imports: [StarIcon, DatePipe],
  templateUrl: './game-detail-content.html',
})
export class GameDetailContent {
  private readonly favorites = inject(FavoriteService);

  game = input.required<Game>();

  protected readonly descriptionExpanded = signal(false);

  protected readonly isFavorite = computed(() =>
    this.favorites.has(this.game().id),
  );

  protected readonly hasLongDescription = computed(
    () =>
      (this.game().description?.length ?? 0) > DESCRIPTION_PREVIEW_THRESHOLD,
  );

  protected readonly uniquePlatforms = computed(() => {
    const seen = new Set<string>();
    const result: { id: number; name: string }[] = [];
    for (const p of this.game().platforms) {
      if (!seen.has(p.platform.slug)) {
        seen.add(p.platform.slug);
        result.push({ id: p.platform.id, name: p.platform.name });
      }
    }
    return result;
  });

  constructor() {
    effect(() => {
      this.game();
      this.descriptionExpanded.set(false);
    });
  }

  protected toggleFavorite(): void {
    this.favorites.toggle(this.game());
  }

  protected toggleDescription(): void {
    this.descriptionExpanded.update((expanded) => !expanded);
  }

  protected heroImage(url: string | null): string | null {
    return resizeRawgImage(url, HERO_WIDTH, HERO_HEIGHT);
  }

  protected screenshotImage(url: string | null): string | null {
    return resizeRawgImage(url, SCREENSHOT_WIDTH);
  }
}
