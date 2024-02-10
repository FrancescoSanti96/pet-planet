import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//Richiamare interfaccia User
@Component({
  selector: 'app-other-pet-profile',
  templateUrl: './other-pet-profile.component.html',
  styleUrl: './other-pet-profile.component.scss'
})
export class OtherPetProfileComponent {
  userId: string | undefined;
  user: any;

  constructor(private route: ActivatedRoute) { }

  /*ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      this.getFriendData();
    });
  }*/
}
