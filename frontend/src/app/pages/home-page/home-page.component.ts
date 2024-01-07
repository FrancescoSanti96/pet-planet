import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../model/post.model';
import { PostService } from '../../services/post.service';
import { CommentDialogComponent } from '../../component/comment-dialog/comment-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  accessToken!: string;
  userInfo: any; // TODO definire interfaccia
  titolo: string = '';
  corpo: string = '';
  id: string = '';
  posts: Post[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private postService: PostService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Recupera il valore dell'access_token dalla query param dell'URL
    this.route.queryParams.subscribe((params) => {
      this.accessToken = params['access_token'];
      this.getUserInfo();
    });
    this.loadPostsData();
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
          // Se l'errore è dovuto a un utente già registrato, cerca l'utente per email
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
    this.postService.createPost(this.id, this.titolo, this.corpo).subscribe(
      (data) => {
        // handle the data
        console.log(data);

        // Dopo aver creato un post, ricarica i post e i commenti associati
        this.loadPostsData();
      },
      (error) => {
        // handle the error
      }
    );
  }

  loadPostsData(): void {
    this.postService.getPosts().subscribe(
      (posts) => {
        this.posts = posts;
  
        // Dopo aver caricato i post, ricarica i commenti associati a ciascun post
        this.posts.forEach((post) => {
          this.getComments(post._id);
        });
        console.log("e",posts);
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
          // handle the data
          console.log(data);

          // Dopo aver creato un commento, ricarica i commenti associati al post
          this.getComments(postId);
        },
        (error) => {
          // handle the error
        }
      );
  }

  getComments(postId: string): void {
    this.postService.getComments(postId).subscribe(
      (comments) => {
        // handle the data
        console.log(comments);
      },
      (error) => {
        // handle the error
      }
    );
  }
}
