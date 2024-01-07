import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { find } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  accessToken!: string;
  userInfo: any; // Ovvero il tuo oggetto UserInfo

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Recupera il valore dell'access_token dalla query param dell'URL
    this.route.queryParams.subscribe((params) => {
      this.accessToken = params['access_token'];

      // Chiamata API per ottenere le informazioni dell'utente
      this.getUserInfo();
    });
  }

  // TODO fare la chiamata solo una volta
  getUserInfo() {
    if(!localStorage.getItem('user_info') !== null) {
      const url = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${this.accessToken}`;

      // Effettua la chiamata API utilizzando HttpClient
      this.http.get(url).subscribe(
        (data: any) => {
          // Gestisci le informazioni ottenute dall'API
          this.userInfo = data;

          // Salva le informazioni nell'oggetto local storage
          localStorage.setItem('user_info', JSON.stringify(this.userInfo));

          console.log('User Info:', this.userInfo);
          this.postLogin(this.userInfo);

          // TODO
          // Se unte gia registrato fare una find
          // si deve salvare l'id nel local storage
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );

      // TODO
      
    }
  }

  postLogin(response: any) {
    this.http
      .post('http://localhost:3000/api/v1/users', {
        email: response.email,
        idGoogle: response.id,
        firstName: response.given_name,
        lastName: response.family_name,
        surname: response.name
      })
      .subscribe(
        (data) => {
          // handle the data
          console.log(data);
        },
        (error) => {
          // handle the error
        }
      );
  }

  getData() {
    this.http.get('http://localhost:3000/api/v1/users').subscribe(
      (data) => {
        // handle the data
        console.log(data);
      },
      (error) => {
        // handle the error
      }
    );
  }
}
