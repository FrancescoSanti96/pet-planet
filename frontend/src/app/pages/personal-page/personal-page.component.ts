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

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.scss'],
})
export class PersonalPageComponent implements OnInit {
  friendsList: Friend[] = [];
  posts: Post[] = [];
  animal: Animal = {} as Animal;

  isLoadingFriends: boolean = false;
  isLoadingPosts: boolean = false;

  constructor(
    private friendService: FriendService,
    private postService: PostService,
    private dialog: MatDialog,
    private reloadService: ReloadService, 
    private animalService: AnimalService
  ) {}

  ngOnInit(): void {
    this.loadPostsData();
    this.loadFriendsData();
    this.loadAnimalsData();
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
      data: { post },  // Passa il post alla dialog
      width: '400px',  // Imposta la larghezza della dialog (adatta secondo necessità)
    });

    dialogRef.afterClosed().subscribe((updatedPostData) => {
      if (updatedPostData) {
        // Puoi gestire i dati aggiornati qui, ad esempio, aggiornando la lista
        // o richiamando nuovamente il metodo loadPostsData().
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
        // Dopo l'eliminazione, ricarica i dati dei post
        // this.loadPostsData();
        this.reloadService.reloadPage();
      },
      (error) => {
        console.error("Errore nell'eliminazione del post:", error);

        console.log('Post ID:', postId);
        console.log('Error Object:', error);
      }
    );
  }

  /*toggleFollowStatus(friend: Friend): void {
    const followStatus = friend.isFollowing;
    friend.isFollowing = !followStatus; // Aggiorna immediatamente la UI

    this.friendService.followFriend(friend._id, !followStatus)
      .subscribe(
        () => {
          // Lascia la logica qui se è necessario eseguire ulteriori azioni dopo il successo
        },
        error => {
          console.error('Errore nella chiamata API per aggiornare lo stato di follow:', error);
          // Ripristina lo stato originale in caso di errore
          friend.isFollowing = followStatus;
        }
      );
  }*/

  unfollow(followId: string): void {
    this.friendService.unfollow(followId).subscribe(
      (response) => {
        console.log('Friend deleted successfully. Friend ID:', followId);
        this.reloadService.reloadPage();
      },
      (error) => {
        console.error('Error deleting friend:', error);
        // Gestisci eventuali errori
      }
    );
  }
}
