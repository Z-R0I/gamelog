import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-game-card-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div
      class="bg-zinc-900/60 rounded-md overflow-hidden border border-zinc-800 flex flex-col"
    >
      <div class="aspect-[460/215] shimmer"></div>
      <div class="p-3 space-y-2 flex-1 flex flex-col">
        <div class="flex items-center gap-3">
          <div class="h-3 w-10 shimmer rounded"></div>
          <div class="h-3 w-20 shimmer rounded"></div>
        </div>
        <div class="flex flex-wrap gap-1 mt-auto">
          <div class="h-4 w-12 shimmer rounded"></div>
          <div class="h-4 w-16 shimmer rounded"></div>
        </div>
      </div>
    </div>
  `,
})
export class GameCardSkeleton {}
