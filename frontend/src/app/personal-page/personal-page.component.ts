import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../pages/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.scss']
})
export class PersonalPageComponent {
  friendsList: any[] = [
    { id: 1, name: 'Amico 1' },
    { id: 2, name: 'Amico 2' },
    { id: 3, name: 'Amico 3' },
    { id: 4, name: 'Amico 4' },
    { id: 5, name: 'Amico 5' },
    { id: 6, name: 'Amico 6' },
  ];

  postList: any[] = [
    { content: 'Questo è un post.' },
    { content: 'Un altro post interessante.' },
    { content: 'Un terzo post.' },
  ];

  constructor(private dialog: MatDialog, private router: Router) { }

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
