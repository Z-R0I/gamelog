import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appSpotlight]',
  standalone: true,
})
export class SpotlightDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    const target = this.el.nativeElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    target.style.setProperty('--spot-x', `${x}px`);
    target.style.setProperty('--spot-y', `${y}px`);
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    const target = this.el.nativeElement;
    target.style.removeProperty('--spot-x');
    target.style.removeProperty('--spot-y');
  }
}
