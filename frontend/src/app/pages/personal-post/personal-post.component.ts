import { Component, OnInit } from '@angular/core';
import { Post } from '../../model/post.model';
import { PostService } from '../../services/post.service';
import { ModifyPostDialogComponent } from '../../component/modify-post-dialog/modify-post-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReloadService } from '../../services/reload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-personal-post',
  templateUrl: './personal-post.component.html',
  styleUrl: './personal-post.component.scss'
})
export class PersonalPostComponent implements OnInit{

  posts: Post[] = [];
  id!: string;
  imagesPostsURL!: SafeUrl[];
  imagesUserPostsURL!: SafeUrl[];
  constructor(
    private postService: PostService,
    private dialog: MatDialog,
    private reloadService: ReloadService, 
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.loadPostsData();

  }

  openModifyPostDialog(post: Post): void {
    const dialogRef = this.dialog.open(ModifyPostDialogComponent, {
      data: { post },  
      width: '400px',  
    });

    dialogRef.afterClosed().subscribe((updatedPostData) => {
      if (updatedPostData) {
        this.loadPostsData();
      }
    });
  }

  deletePost(postId: string): void {
    this.postService.deletePost(postId).subscribe(
      () => {
        this.reloadService.reloadPage();
      },
      (error) => {
        console.error("Errore nell'eliminazione del post:", error);
      }
    );
  }

  loadPostsData(): void {
    this.id = localStorage.getItem('id')!;
    this.postService.getPostByUserID(this.id).subscribe(
      (posts) => {
        this.posts = posts;
        this.imagesUserPostsURL = this.posts.map(post => this.sanitizer.bypassSecurityTrustUrl(post.profilePic));
        this.imagesPostsURL = this.posts.map(post => this.sanitizer.bypassSecurityTrustUrl(post.img));
      },
      (error) => {
        console.error(
          'Errore nella chiamata API per ottenere la lista di post:',
          error
        );
      }
    );
  }
}
