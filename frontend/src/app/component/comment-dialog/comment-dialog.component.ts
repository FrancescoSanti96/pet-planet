import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss'],
})
export class CommentDialogComponent {
  commentBody: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    // Puoi eseguire l'azione desiderata qui, ad esempio, chiamare il metodo createComment
    // e passare il corpo del commento come parametro.
    // this.data.postId è l'ID del post associato al commento.
    this.dialogRef.close(this.commentBody);
  }
}
