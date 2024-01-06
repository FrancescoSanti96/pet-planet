import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.scss']
})
export class PersonalPageComponent implements OnInit {
  friendsList: any[] = [];
  postList: any[] = [];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/v1/friends')
      .subscribe(
        friends => {
          this.friendsList = friends;
        },
        error => {
          console.error('Errore nella chiamata API per ottenere la lista di amici:', error);
        }
      );

    this.http.get<any[]>('http://localhost:3000/api/v1/posts')
      .subscribe(
        posts => {
          this.postList = posts;
        },
        error => {
          console.error('Errore nella chiamata API per ottenere la lista di post:', error);
        }
      );
  }

  openConfirmationDialog(friend: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { friendName: friend.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.friendsList.findIndex(f => f.id === friend.id);
        if (index !== -1) {
          this.friendsList.splice(index, 1);
        }
      }
    });
  }

  startChat(friendId: number): void {
    this.router.navigate(['/chat', friendId]);
  }
}
