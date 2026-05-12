import { Location } from '@angular/common';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { SubscriptionLike } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameDetailModalService {
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _openId = signal<number | null>(null);
  private previousUrl: string | null = null;
  private popSubscription: SubscriptionLike | null = null;

  readonly openId = this._openId.asReadonly();
  readonly isOpen = computed(() => this._openId() !== null);

  constructor() {
    this.popSubscription = this.location.subscribe(() => {
      if (this._openId() !== null) {
        this._openId.set(null);
        this.previousUrl = null;
      }
    });
    this.destroyRef.onDestroy(() => this.popSubscription?.unsubscribe());
  }

  open(id: number): void {
    if (!Number.isFinite(id)) return;
    if (this._openId() === id) return;
    if (this._openId() === null) {
      this.previousUrl = this.location.path() || '/';
    }
    this._openId.set(id);
    this.location.go(`/game/${id}`);
  }

  close(): void {
    if (this._openId() === null) return;
    this._openId.set(null);
    if (this.previousUrl !== null) {
      this.location.replaceState(this.previousUrl);
      this.previousUrl = null;
    }
  }
}
