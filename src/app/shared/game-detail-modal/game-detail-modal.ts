import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { GameDetailContent } from '../../features/game-detail/game-detail-content';
import { GameDetailSkeleton } from '../../features/game-detail/game-detail-skeleton';
import { RawgService } from '../../core/services/rawg.service';
import { GameDetailModalService } from '../../core/services/game-detail-modal.service';

@Component({
  selector: 'app-game-detail-modal',
  imports: [GameDetailContent, GameDetailSkeleton],
  templateUrl: './game-detail-modal.html',
  styleUrl: './game-detail-modal.css',
})
export class GameDetailModal {
  private readonly modal = inject(GameDetailModalService);
  private readonly rawg = inject(RawgService);
  private readonly document = inject(DOCUMENT);

  private readonly dialogRef =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly isOpen = this.modal.isOpen;
  protected readonly resource = this.rawg.gameByIdResource(() =>
    this.modal.openId(),
  );
  protected readonly game = computed(() => this.resource.value());

  constructor() {
    effect(() => {
      const dialog = this.dialogRef().nativeElement;
      if (this.isOpen()) {
        if (!dialog.open) dialog.showModal();
        this.document.body.style.overflow = 'hidden';
      } else {
        if (dialog.open) dialog.close();
        this.document.body.style.overflow = '';
      }
    });
  }

  protected onDialogClose(): void {
    this.modal.close();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogRef().nativeElement) {
      this.modal.close();
    }
  }

  protected retry(): void {
    this.resource.reload();
  }
}
