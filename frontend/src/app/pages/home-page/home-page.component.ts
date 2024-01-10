import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../model/post.model';
import { PostService } from '../../services/post.service';
import { CommentDialogComponent } from '../../component/comment-dialog/comment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReloadService } from '../../services/reload.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  accessToken!: string;
  userInfo: any; 
  titolo: string = '';
  corpo: string = '';
  id: string = '';
  posts: Post[] = [];
  private refreshDone = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private postService: PostService,
    private dialog: MatDialog,
    private reloadService: ReloadService,
  ) {}

  ngOnInit(): void {
// Recupera il valore dell'access_token dalla query param dell'URL
    this.route.queryParams.subscribe((params) => {
      this.accessToken = params['access_token'];
      this.getUserInfo();
    });
    setTimeout(() => {
      this.loadPostsData();
    },200);
  }

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
  }

  loadPostsData(): void {
    this.id = localStorage.getItem('id')!;
    this.postService.getPostsOfFriends(this.id).subscribe(
      (posts) => {
        this.posts = posts;
          this.posts.forEach((post) => {
          this.getComments(post._id);
        });

      },
      (error) => {
        console.error(
          'Errore nella chiamata API per ottenere la lista di post:',
          error
        );
      }
    );
  }
  

  openCommentDialog(postId: string): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '400px',
      data: { postId: postId },
    });

    dialogRef.afterClosed().subscribe((commentBody) => {
      if (commentBody) {
        this.createComment(postId, commentBody);
      }
    });
  }

  createComment(postId: string, commentBody: string): void {
    this.postService
      .createComment(postId, {
        utente: this.id,
        testo: commentBody,
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.getComments(postId);
          this.reloadService.reloadPage();
        },
        (error) => {
        }
      );
  }

  getComments(postId: string): void {
    this.postService.getComments(postId).subscribe(
      (comments) => {
        console.log(comments);
      },
      (error) => {
      }
    );
  }
}
