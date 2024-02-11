import { Component, Inject } from '@angular/core';
import { Friend } from '../../model/friend.model';
import { FriendService } from '../../services/friend.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReloadService } from '../../services/reload.service';
import { FollowerService } from '../../services/follower.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follower-dialog',
  templateUrl: './follower-dialog.component.html',
  styleUrl: './follower-dialog.component.scss'
})
export class FollowerDialogComponent {
  friendsList: Friend[] = [];
  followersList: Friend[] = [];
  isLoadingFriends: boolean = false;
  filteredFollowers: Friend[] | undefined

  searchText = '';

  constructor(
    private friendService: FriendService,
    private reloadService: ReloadService,
    private followerService: FollowerService,
    private http: HttpClient,
    private router: Router,

    public dialogRef: MatDialogRef<FollowerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.loadFriendsData();
    this.loadFollowersData();
  }

  filterFollowers(): void {
    // Filtra gli utenti in base alla searchText
    const filteredFollowers = this.followersList.filter(friend =>
      friend.amico.toLowerCase().startsWith(this.searchText.toLowerCase())
    );

    // Assegna i risultati filtrati a una variabile visualizzata nell'HTML
    this.filteredFollowers = filteredFollowers;
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

  closeDialogPetFollower(): void {
    this.dialogRef.close();
  }

}
