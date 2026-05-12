import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-game-detail-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="animate-pulse">
      <div class="aspect-[21/9] bg-zinc-800"></div>
      <div class="p-6 md:p-8 space-y-4">
        <div class="h-10 w-2/3 bg-zinc-800 rounded"></div>
        <div class="flex gap-3">
          <div class="h-9 w-36 bg-zinc-800 rounded"></div>
          <div class="h-9 w-20 bg-zinc-800 rounded"></div>
          <div class="h-9 w-20 bg-zinc-800 rounded"></div>
        </div>
        <div class="flex gap-2 pt-2">
          @for (i of placeholders; track i) {
            <div class="h-6 w-20 bg-zinc-800 rounded"></div>
          }
        </div>
      </div>
    </div>
  `,
})
export class GameDetailSkeleton {
  protected readonly placeholders = [1, 2, 3, 4];
}
