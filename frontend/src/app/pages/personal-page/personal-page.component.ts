import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.scss']
})
export class PersonalPageComponent implements OnInit {
  friendsList: any[] = [];
  postList: any[] = [];

  isLoadingFriends: boolean = false;
  isLoadingPosts: boolean = false;

  isPostListVisible: boolean = false;
  isFriendListVisible: boolean = false;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadPostsData();
    this.loadFriendsData();
  }

  loadFriendsData(): void {
    this.isLoadingFriends = true;
    this.http.get<any[]>('http://localhost:3000/api/v1/friends')
      .subscribe(
        friends => {
          this.friendsList = friends;
          this.isFriendListVisible = true;
          this.isLoadingFriends = false;
        },
        error => {
          console.error('Errore nella chiamata API per ottenere la lista di amici:', error);
          this.isLoadingFriends = false;
        }
      );
  }

  loadPostsData(): void {
    this.isLoadingPosts = true;
    this.http.get<any[]>('http://localhost:3000/api/v1/posts')
      .subscribe(
        posts => {
          this.postList = posts;
          this.isPostListVisible = true;
          this.isLoadingPosts = false;
        },
        error => {
          console.error('Errore nella chiamata API per ottenere la lista di post:', error);
          this.isLoadingPosts = false;
        }
      );
  }

  toggleFriendListVisibility(): void {
    this.isFriendListVisible = !this.isFriendListVisible;
    if (this.isFriendListVisible) {
      this.isPostListVisible = false;
    }
  }

  togglePostListVisibility(): void {
    this.isPostListVisible = !this.isPostListVisible;
    if (this.isPostListVisible) {
      this.isFriendListVisible = false;
    }
  }
}
