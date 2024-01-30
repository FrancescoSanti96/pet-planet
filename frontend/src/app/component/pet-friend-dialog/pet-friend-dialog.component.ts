import { Component, Inject } from '@angular/core';
import { Friend } from '../../model/friend.model';
import { FriendService } from '../../services/friend.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReloadService } from '../../services/reload.service';
import { FollowerService } from '../../services/follower.service';

@Component({
  selector: 'app-pet-friend-dialog',
  templateUrl: './pet-friend-dialog.component.html',
  styleUrl: './pet-friend-dialog.component.scss'
})
export class PetFriendDialogComponent {
  friendsList: Friend[] = [];
  followersList: Friend[] = [];
  isLoadingFriends: boolean = false;

  constructor(
    private friendService: FriendService,
    private reloadService: ReloadService,
    private followerService: FollowerService,

    public dialogRef: MatDialogRef<PetFriendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.loadFriendsData();
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

}
