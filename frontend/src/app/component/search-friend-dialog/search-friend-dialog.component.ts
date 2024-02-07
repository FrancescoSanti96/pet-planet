import { Component, Inject, OnInit } from '@angular/core';
import { FriendService } from '../../services/friend.service';
import { Friend } from '../../model/friend.model';
import { ReloadService } from '../../services/reload.service';
import { HttpClient } from '@angular/common/http';
import { FollowerService } from '../../services/follower.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
interface User {
  _id: string;
  email: string;
}
@Component({
  selector: 'app-search-friend-dialog',
  templateUrl: './search-friend-dialog.component.html',
  styleUrl: './search-friend-dialog.component.scss'
})

export class SearchFriendDialogComponent {
  friendsList: Friend[] = [];
  followersList: Friend[] = [];
  usersList: User[] = [];
  filteredUsers: User[] | undefined 

  isLoadingFriends: boolean = false;
  isLoadingPosts: boolean = false;
  isFindNewFriends: boolean = false;
  id!: string;

  searchText = '';

  constructor(
    private friendService: FriendService,
    private reloadService: ReloadService,
    private http: HttpClient,
    private followerService: FollowerService,

    public dialogRef: MatDialogRef<SearchFriendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.loadFriendsData();
    this.loadUsersDataExceptOne();
    this.loadFollowersData();
  }

  filterUsers(): void {
    // Filtra gli utenti in base alla searchText
    const filteredUsers = this.usersList.filter(user =>
      user.email.toLowerCase().startsWith(this.searchText.toLowerCase())
    );

    // Assegna i risultati filtrati a una variabile visualizzata nell'HTML
    this.filteredUsers = filteredUsers;
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
