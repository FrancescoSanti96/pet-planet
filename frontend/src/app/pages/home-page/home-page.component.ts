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
  titolo: string = '';
  corpo: string = '';

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
        (data: any) => {
          // Verifica se l'ID è presente nella risposta
          if (data && data._id) {
            // Salva l'ID nello storage
            localStorage.setItem('id', data._id);
          } else {
            console.error('L\'ID non è presente nella risposta del server');
          }
        },
        (error) => {
          // handle the error
  
          // Se l'errore è dovuto a un utente già registrato, cerca l'utente per email
          if (error.status === 400 && error.error && error.error.error === 'Utente già registrato con questa email') {
            this.http
              .get(`http://localhost:3000/api/v1/users/email/${response.email}`)
              .subscribe(
                (user: any) => {
                  // Puoi fare qualcosa con l'utente recuperato, ad esempio, salvare l'ID nello storage
                  if (user && user._id) {
                    localStorage.setItem('id', user._id);
                  } else {
                    console.error('L\'ID dell\'utente non è presente nella risposta del server');
                  }
                },
                (getUserError) => {
                  console.error('Errore durante il recupero dell\'utente per email', getUserError);
                }
              );
          }
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
  
  createPost() {
    this.http
      .post('http://localhost:3000/api/v1/posts', {
        utente: '659ac101a037e999c99c5494',
        titolo: 'test',
        corpo: 'test'
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

}
