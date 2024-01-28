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

  constructor(
    private http: HttpClient,
    private postService: PostService,

    public dialogRef: MatDialogRef<CreatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  getUserInfo() {
    if (!localStorage.getItem('user_info') !== null) {
      const url = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${this.accessToken}`;

      this.http.get(url).subscribe(
        (data: any) => {
          this.userInfo = data;
          localStorage.setItem('user_info', JSON.stringify(this.userInfo));
          this.postLogin(this.userInfo);
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    }
  }

  postLogin(response: any) {
    this.http
      .post('http://localhost:3000/api/v1/users', {
        email: response.email,
        idGoogle: response.id,
        firstName: response.given_name,
        lastName: response.family_name,
        surname: response.name,
        profilePicture: response.picture,
      })
      .subscribe(
        (data: any) => {
          if (data && data._id) {
            localStorage.setItem('id', data._id);
            this.id = data._id;

          } else {
            console.error("L'ID non è presente nella risposta del server");
          }
        },
        (error) => {
          if (
            error.status === 400 &&
            error.error &&
            error.error.error === 'Utente già registrato con questa email'
          ) {
            this.http
              .get(`http://localhost:3000/api/v1/users/email/${response.email}`)
              .subscribe(
                (user: any) => {
                  if (user && user._id) {
                    localStorage.setItem('id', user._id);
                    this.id = user._id;
                  } else {
                    console.error(
                      "L'ID dell'utente non è presente nella risposta del server"
                    );
                  }
                },
                (getUserError) => {
                  console.error(
                    "Errore durante il recupero dell'utente per email",
                    getUserError
                  );
                }
              );
          }
        }
      );
  }

  createPost() {
    this.id = localStorage.getItem('id')!;
    this.userInfo = JSON.parse(localStorage.getItem('user_info')!);
    this.postService.createPost(this.id, this.titolo, this.corpo, this.userInfo.picture).subscribe(
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
}
