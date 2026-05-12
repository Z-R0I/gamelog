import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-star-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="transition-colors duration-200"
      [class]="iconClasses()"
    >
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
  `,
})
export class StarIcon {
  filled = input<boolean>(false);
  strokeWidth = input<number>(2);
  filledColor = input<string>('fill-amber-400 stroke-amber-400');
  emptyColor = input<string>('fill-transparent stroke-white');

  protected readonly iconClasses = computed(() =>
    this.filled() ? this.filledColor() : this.emptyColor(),
  );
}
