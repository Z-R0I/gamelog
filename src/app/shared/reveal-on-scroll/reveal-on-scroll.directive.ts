import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  delay = input<number>(0);
  threshold = input<number>(0.1);

  constructor() {
    afterNextRender(() => {
      const target = this.el.nativeElement;
      target.classList.add('reveal-on-scroll');
      if (this.delay() > 0) {
        target.style.transitionDelay = `${this.delay()}ms`;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              target.classList.add('reveal-on-scroll-visible');
              observer.unobserve(target);
              break;
            }
          }
        },
        { threshold: this.threshold(), rootMargin: '0px 0px -40px 0px' },
      );

      observer.observe(target);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
