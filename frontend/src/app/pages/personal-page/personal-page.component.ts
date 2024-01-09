import { Component, OnInit } from '@angular/core';
import { FriendService } from '../../services/friend.service';
import { Friend } from '../../model/friend.model';
import { PostService } from '../../services/post.service';
import { Post } from '../../model/post.model';
import { ModifyPostDialogComponent } from '../../component/modify-post-dialog/modify-post-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReloadService } from '../../services/reload.service';
import { Animal } from '../../model/animal.model';
import { AnimalService } from '../../services/animal.service';
import { HttpClient } from '@angular/common/http';
import { FollowerService } from '../../services/follower.service';
interface User {
  _id: string;
  email: string;
  // Altre proprietà dell'utente se presenti
}
@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.scss'],
})
export class PersonalPageComponent implements OnInit {
  
  
  friendsList: Friend[] = [];
  followersList: Friend[] = [];
  posts: Post[] = [];
  animal: Animal = {} as Animal;
  usersList: User[] = [];

  isLoadingFriends: boolean = false;
  isLoadingPosts: boolean = false;
  isFindNewFriends: boolean = false;

  constructor(
    private friendService: FriendService,
    private postService: PostService,
    private dialog: MatDialog,
    private reloadService: ReloadService, 
    private animalService: AnimalService,
    private http: HttpClient,
    private followerService: FollowerService
  ) {}

  ngOnInit(): void {
    this.loadPostsData();
    this.loadFriendsData();
    this.loadAnimalsData();
    this.loadUsersDataExceptOne();
    this.loadFollowersData();
  }

  loadFriendsData(): void {
    this.isLoadingFriends = true;
    this.friendService.getFriends().subscribe(
      (friends) => {
        this.friendsList = friends.map((friend) => {
          const { _id, utente, amico } = friend;
          if (_id && utente && amico) {
            return new Friend(_id, utente, amico);
          } else {
            console.error('Oggetto amico non valido:', friend);
            // Puoi gestire questa situazione restituendo un oggetto Friend con valori predefiniti o ignorando l'oggetto.
            return new Friend('', '', '');
          }
        });
        this.isLoadingFriends = false;
      },

      (error) => {
        console.error(
          'Errore nella chiamata API per ottenere la lista di amici:',
          error
        );
        this.isLoadingFriends = false;
      }
    );
  }

  loadFollowersData(): void {
    this.followerService.getFollowers().subscribe(
      (followers) => {
        this.followersList = followers.map((follower) => {
          const { _id, utente, amico } = follower;
          if (_id && utente && amico) {
            return new Friend(_id, utente, amico);
          } else {
            console.error('Oggetto amico non valido:', follower);
            return new Friend('', '', '');
          }
        });
      },

      (error) => {
        console.error(
          'Errore nella chiamata API per ottenere la lista di amici:',
          error
        );
      }
    );
  }

  // TODO anche quelli gia presenti in friend non sono da vedere
  loadUsersDataExceptOne(): void {
    const id = localStorage.getItem('id')!;
    this.http.get<User[]>(`http://localhost:3000/api/v1/users/except/${id}`).subscribe(
      (users) => {
        this.usersList = users;
      },
      (error) => {
        console.error('Errore nel recupero degli utenti:', error);
      }
    );
  }

  findNewFriends(): void {
    this.isFindNewFriends = !this.isFindNewFriends;
  }

  loadPostsData(): void {
    this.postService.getPostByUserID().subscribe(
      (posts) => {
        this.posts = posts;
      },
      (error) => {
        console.error(
          'Errore nella chiamata API per ottenere la lista di post:',
          error
        );
      }
    );
  }

  loadAnimalsData(): void {
    this.animalService.getAnimalByUserId().subscribe(
      (animal) => {
        if (animal !== null) {
          this.animal = animal;  // Assegna gli animali alla proprietà animal del tuo componente
        }
      },
      (error) => {
        console.error(
          'Errore nella chiamata API per ottenere la lista di animali:',
          error
        );
      }
    );
  }

  checkAnimal(): boolean {
    return this.animal ? Object.keys(this.animal).length > 0 : false;
  }
  
  

  openModifyPostDialog(post: Post): void {
    const dialogRef = this.dialog.open(ModifyPostDialogComponent, {
      data: { post },  
      width: '400px',  
    });

    dialogRef.afterClosed().subscribe((updatedPostData) => {
      if (updatedPostData) {
        console.log('Post aggiornato:', updatedPostData);
        this.loadPostsData();
      }
    });
  }

  // Metodo per eliminare un post
  deletePost(postId: string): void {
    this.postService.deletePost(postId).subscribe(
      () => {
        console.log('Post eliminato con successo');
        this.reloadService.reloadPage();
      },
      (error) => {
        console.error("Errore nell'eliminazione del post:", error);

        console.log('Post ID:', postId);
        console.log('Error Object:', error);
      }
    );
  }

  unfollow(followId: string, email: string): void {
    this.friendService.unfollow(followId).subscribe(
      (response) => {
        this.removeFollower(email);
        this.reloadService.reloadPage();
      },
      (error) => {
      }
    );
  }
  removeFollower( mail: string): void {
    const id = localStorage.getItem('id')!;
    this.followerService.removeFollower(id, mail).subscribe(
        (response) => {
        },
        (error) => {
            console.error('Errore durante la rimozione del follower:', error);
        }
    );
}


  followUser( email: string, userId:string): void {
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

  addFollower(userId: string ): void {
    console.log('addFollower', this.followersList);
    const email = JSON.parse(localStorage.getItem('user_info') || '{}').email;
    this.followerService.addFollower(userId, email).subscribe(
      (response) => {
      },
      (error) => {
        console.error('Error add friend:', error);
      }
    );
  }
}
