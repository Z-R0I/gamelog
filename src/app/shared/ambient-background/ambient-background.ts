import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ambient-background',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div
      aria-hidden="true"
      class="ambient-root pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div class="ambient-orb ambient-orb-1"></div>
      <div class="ambient-orb ambient-orb-2"></div>
      <div class="ambient-orb ambient-orb-3"></div>
      <div class="ambient-orb ambient-orb-4"></div>
      <div class="ambient-noise"></div>
      <div class="ambient-vignette"></div>
    </div>
  `,
  styleUrl: './ambient-background.css',
})
export class AmbientBackground {}
