import { Component, Inject } from '@angular/core';
import { Friend } from '../../model/friend.model';
import { FriendService } from '../../services/friend.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReloadService } from '../../services/reload.service';
import { FollowerService } from '../../services/follower.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../model/user.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pet-friend-dialog',
  templateUrl: './pet-friend-dialog.component.html',
  styleUrl: './pet-friend-dialog.component.scss'
})
export class PetFriendDialogComponent {
  friendsList: Friend[] = [];
  followersList: Friend[] = [];
  isLoadingFriends: boolean = false;
  filteredFriends: Friend[] | undefined 
  imagesUserURL: SafeUrl[] = [];

  searchText = '';

  constructor(
    private friendService: FriendService,
    private router: Router,
    private followerService: FollowerService,
    private reloadService: ReloadService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public dialogRef: MatDialogRef<PetFriendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.loadFriendsData();
    this.loadFollowersData();
  }

  filterFriends(): void {
    // Filtra gli utenti in base alla searchText
    const filteredFriends = this.friendsList.filter(friend =>
      friend.amico.toLowerCase().startsWith(this.searchText.toLowerCase())
    );

    // Assegna i risultati filtrati a una variabile visualizzata nell'HTML
    this.filteredFriends = filteredFriends;
  }

  loadFriendsData(): void {
    this.isLoadingFriends = true;
    this.friendService.getFriends().subscribe(
      (friends) => {
        this.friendsList = friends.map((friend) => {
          this.http.get<User>(`http://localhost:3000/api/v1/users/email/${friend.amico}`).subscribe(
            (user) => {
              if (user.profilePicture){
                this.imagesUserURL.push(this.sanitizer.bypassSecurityTrustUrl(user.profilePicture!));
                console.log("test", this.imagesUserURL);
              }
              else{
                this.imagesUserURL.push((''));
              }

            },
            (error) => {
              console.error('Errore nel recupero dell\'utente:', error);
            }
          );
  
          const { _id, utente, amico } = friend;
          if (_id && utente && amico) {
            return new Friend(_id, utente, amico);
          } else {
            console.error('Oggetto amico non valido:', friend);
            return new Friend('', '', '');
          }
        });
        this.isLoadingFriends = false;
      },
      (error) => {
        console.error('Errore nella chiamata API per ottenere la lista di amici:', error);
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
  removeFollower(mail: string): void {
    const id = localStorage.getItem('id')!;
    this.followerService.removeFollower(id, mail).subscribe(
      (response) => {
      },
      (error) => {
        console.error('Errore durante la rimozione del follower:', error);
      }
    );
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

  redirectToFriendProfile(userId: string) {
    this.http.get<User>(`http://localhost:3000/api/v1/users/email/${userId}`).subscribe(
      (user) => {
        this.router.navigate(['/other-pet-profile', user._id]);
        this.dialogRef.close();
      },
      (error) => {
        console.error('Errore nel recupero dell\'utente:', error);
      }
    );
  }

  closeDialogPetFriend(): void {
    this.dialogRef.close();
  }

}
