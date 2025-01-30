import { Component, Inject } from '@angular/core';
import { NbDialogRef, NB_DIALOG_CONFIG } from '@nebular/theme';

@Component({
  selector: 'ngx-confirmation-dialog',
  template: `
    <nb-card>
      <nb-card-header>{{ title }}</nb-card-header>
      <nb-card-body>{{ message }}</nb-card-body>
      <nb-card-footer class="d-flex justify-content-end">
        <button nbButton status="success" (click)="close(true)" class="mr-2 no-focus">Confirmar</button>
        <button nbButton status="danger" (click)="close(false)" class="no-focus">Cancelar</button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [
    `
      .mr-2 {
        margin-right: 8px; 
      }
      .no-focus:focus {
      outline: none;
      box-shadow: none;
      }
    `,
  ],
})
export class ConfirmationDialogComponent {
    title: string;
    message: string;

  constructor(protected dialogRef: NbDialogRef<ConfirmationDialogComponent>) {}

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}