import { Component } from '@angular/core';

@Component({
  selector: 'app-google-auth',
  template: `
    <a [href]="getGoogleAuthUrl()">
      Google Login
    </a>
  `,
})
export class GoogleAuthComponent {
  constructor() {}

  getGoogleAuthUrl(): string {
    return 'http://localhost:3000/oauth2/google'; // Adjust the URL accordingly
  }
}
