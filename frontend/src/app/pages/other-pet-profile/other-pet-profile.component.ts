import { Component, Inject, OnInit } from '@angular/core';
import { FriendService } from '../../services/friend.service';
import { Friend } from '../../model/friend.model';
import { FollowerService } from '../../services/follower.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../model/user.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../model/animal.model';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-other-pet-profile',
  templateUrl: './other-pet-profile.component.html',
  styleUrl: './other-pet-profile.component.scss'
})
export class OtherPetProfileComponent {

  friendsList: Friend[] = [];
  followersList: Friend[] = [];
  usersList: User[] = [];
  animal: Animal = {} as Animal;
  isLoadingFriends: boolean = false;
  imageURL!: SafeUrl;
  userId!: string;

  constructor(
    private route: ActivatedRoute,
    private friendService: FriendService,
    private followerService: FollowerService,
    private animalService: AnimalService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private location: Location,
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId')!;
      this.loadAnimalsData();
      this.loadFriendsData();
      this.loadFollowersData();
    }
    );

  }

  loadFriendsData(): void {
    this.isLoadingFriends = true;
    this.friendService.getFriendsOtherProfile(this.userId).subscribe(
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
    this.followerService.getFollowersOtherProfile(this.userId).subscribe(
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

  loadAnimalsData(): void {
    this.animalService.getAnimalOtherProfileByUserId(this.userId).subscribe(
      (animal) => {
        if (animal !== null) {
          this.animal = animal;
          // Sanitize the URL to make it safe
          this.imageURL = this.sanitizer.bypassSecurityTrustUrl(animal.image);
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

  goBack(): void {
    this.location.back();
  }
}
