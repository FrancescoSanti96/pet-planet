import { Component, OnInit } from '@angular/core';
import { FriendService } from '../../services/friend.service';
import { Friend } from '../../model/friend.model';
import { PostService } from '../../services/post.service';
import { Post } from '../../model/post.model';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.scss'],
})
export class PersonalPageComponent implements OnInit {
  friendsList: Friend[] = [];
  posts: Post[] = [];

  isLoadingFriends: boolean = false;
  isLoadingPosts: boolean = false;

  isPostListVisible: boolean = false;
  isFriendListVisible: boolean = false;

  constructor(
    private friendService: FriendService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.loadPostsData();
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
            // Puoi gestire questa situazione restituendo un oggetto Friend con valori predefiniti o ignorando l'oggetto.
            return new Friend('', '', '');
          }
        });
        this.isFriendListVisible = true;
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

  // Metodo per aggiornare un post
  updatePost(
    postId: string,
    updatedData: { titolo: string; corpo: string }
  ): void {
    this.postService.modifyPost(postId, updatedData).subscribe(
      (updatedPost) => {
        console.log('Post aggiornato con successo:', updatedPost);
        // Dopo l'aggiornamento, ricarica i dati dei post
        this.loadPostsData();
      },
      (error) => {
        console.error("Errore nell'aggiornamento del post:", error);
      }
    );
  }

  // Metodo per eliminare un post
  deletePost(postId: string): void {
    this.postService.deletePost(postId).subscribe(
      () => {
        console.log('Post eliminato con successo');
        // Dopo l'eliminazione, ricarica i dati dei post
        this.loadPostsData();
      },
      (error) => {
        console.error("Errore nell'eliminazione del post:", error);
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
      },
      (error) => {
        console.error('Error deleting friend:', error);
        // Gestisci eventuali errori
      }
    );
  }
}
