import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../model/post.model';
import { PostService } from '../../services/post.service';
import { CommentDialogComponent } from '../../component/comment-dialog/comment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReloadService } from '../../services/reload.service';
import { CreatePostDialogComponent } from '../../component/create-post-dialog/create-post-dialog.component';
import { SearchFriendDialogComponent } from '../../component/search-friend-dialog/search-friend-dialog.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { User } from '../../model/user.model';
import { Friend } from '../../model/friend.model';
import { FriendService } from '../../services/friend.service';
import { FollowerService } from '../../services/follower.service';

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
  email: string = '';
  posts: Post[] = [];
  // imageURL!: SafeUrl;
  imagesPostsURL!: SafeUrl[];
  imagesUserPostsURL!: SafeUrl[];
  imgUser!: string;
  // imgUserURL
  usersList: User[] = [];
  followersList: Friend[] = [];
  friendsList: Friend[] = [];
  isLoadingFriends: boolean = false;
  randomUsers: any[] | undefined;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private postService: PostService,
    private dialog: MatDialog,
    private reloadService: ReloadService,
    private sanitizer: DomSanitizer,
    private friendService: FriendService,
    private followerService: FollowerService,
  ) { }

  ngOnInit(): void {
    // Recupera il valore dell'access_token dalla query param dell'URL
    this.route.queryParams.subscribe((params) => {
      this.accessToken = params['access_token'];
      this.getUserInfo();
    });
    setTimeout(() => {
      this.loadPostsData();
      this.getAllUsersRandomExceptOne();
    }, 300);
  }

  navigateToProfile() {
    window.location.href = '/profile';
  }

  getAllUsersRandomExceptOne(): void {
    const id = localStorage.getItem('id')!;
    this.http.get<User[]>(`http://localhost:3000/api/v1/users/except/random/${id}`).subscribe(
      (users) => {
        this.usersList = users;
      },
      (error) => {
        console.error('Errore nel recupero degli utenti:', error);
      }
    );
  }

  redirectToFriendProfile(userId: string) {
    this.router.navigate(['/other-pet-profile', userId]);
  }

  followUser(email: string, userId: string): void {
    const id = localStorage.getItem('id')!;
    this.friendService.follow(id, email).subscribe(
      (response) => {
        this.addFollower(userId);
        this.reloadService.reloadPage();
      },
      (error) => {
        console.error('Error add friend:', error);
      }
    );
  }

  addFollower(userId: string): void {
    const email = JSON.parse(localStorage.getItem('user_info') || '{}').email;
    this.followerService.addFollower(userId, email).subscribe(
      (response) => {
      },
      (error) => {
        console.error('Error add friend:', error);
      }
    );
  }

  getUserInfo() {
    if (!localStorage.getItem('user_info') !== null) {
      const url = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${this.accessToken}`;

      this.http.get(url).subscribe(
        (data: any) => {
          console.log('User info: quiiii', data);
          this.userInfo = data;
          // const url = this.userInfo.picture;
          this.http.get(data.picture, { responseType: 'blob' }).subscribe(
            (blob: Blob) => {
              // Scarica l'immagine come blob
              const reader = new FileReader();

              // TODO commentare
              reader.onloadend = () => {
                // Converti l'immagine in formato base64
                this.userInfo.picture = reader.result as string;

                // Ora puoi chiamare this.postLogin(this.userInfo)
                this.postLogin(this.userInfo);
                localStorage.setItem('user_info', JSON.stringify(this.userInfo));
              };
              reader.readAsDataURL(blob);
              // TODO scommentare
              // this.postLogin(this.userInfo);
              // localStorage.setItem('user_info', JSON.stringify(this.userInfo));
            },
            (error) => {
              console.error('Errore durante il recupero dell\'immagine:', error);
            }
          );
          
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
            console.log('ID: qua non ci sono 1', data._id);
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

  loadPostsData(): void {
    this.id = localStorage.getItem('id')!;
    if(this.id !== null) {
    this.postService.getPostsOfFriends(this.id).subscribe(
      (posts) => {
        this.posts = posts;
        this.imagesUserPostsURL = this.posts.map(post => this.sanitizer.bypassSecurityTrustUrl(post.profilePic));
        this.imagesPostsURL = this.posts.map(post => this.sanitizer.bypassSecurityTrustUrl(post.img));
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

  openCreatePostDialog(titolo: string, corpo: string): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {
      width: '400px',
      height: '450px',
      data: { titolo: titolo, corpo: corpo },
    });
    dialogRef.componentInstance.dialogRef = dialogRef;

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog chiuso', result);
    });
  }

  openSearchFriendDialog(): void {
    const dialogRef = this.dialog.open(SearchFriendDialogComponent, {
      width: '400px',
      height: '400px',
      data: {},
    });
  }

  createComment(postId: string, commentBody: string): void {
    this.postService
      .createComment(postId, {
        utente: this.id,
        testo: commentBody,
        email: this.userInfo.email
      })
      .subscribe(
        (data) => {
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
