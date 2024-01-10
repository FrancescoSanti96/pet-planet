import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostService } from '../../services/post.service';
import { Post } from '../../model/post.model';


@Component({
  selector: 'app-modify-post-dialog',
  templateUrl: './modify-post-dialog.component.html',
  styleUrls: ['./modify-post-dialog.component.scss'],
})
export class ModifyPostDialogComponent {
  updatedPost: { titolo: string; corpo: string };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { post: Post },
    public dialogRef: MatDialogRef<ModifyPostDialogComponent>,
    private postService: PostService 
  ) {
    this.updatedPost = { ...data.post }; 
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.postService.modifyPost(this.data.post._id, this.updatedPost).subscribe(
      (updatedPost) => {
        this.dialogRef.close(updatedPost);
      },
      (error) => {
        console.error("Errore nell'aggiornamento del post:", error);
      }
    );
  }
}
