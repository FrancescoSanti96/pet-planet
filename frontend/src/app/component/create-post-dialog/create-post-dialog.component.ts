import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-create-post-dialog',
  templateUrl: './create-post-dialog.component.html',
  styleUrl: './create-post-dialog.component.scss'
})
export class CreatePostDialogComponent {
  accessToken!: string;
  userInfo: any;
  id: string = '';
  titolo: string = '';
  corpo: string = '';
  img!: string;

  constructor(
    private postService: PostService,

    public dialogRef: MatDialogRef<CreatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  createPost() {
    this.id = localStorage.getItem('id')!;
    this.userInfo = JSON.parse(localStorage.getItem('user_info')!);
    this.postService.createPost(this.id, this.titolo, this.corpo, this.userInfo.picture, this.img).subscribe(
      (data) => {
      },
      (error) => {
      }
    );
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  caricaImmagine(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      this.img = reader.result as string;
    }

    if (file) {
      reader.readAsDataURL(file);
    }
  }
}
