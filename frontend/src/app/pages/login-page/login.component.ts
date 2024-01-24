import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string | undefined;
  password: string | undefined;
  hidePassword: boolean = true;

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  constructor(
    private router: Router,
    private http: HttpClient
    ) { }

  navigateToRegistration() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    const formData = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/v1/users/login', formData)
      .subscribe(
        (response) => {
          // Gestisci la risposta dal server
          console.log('Login effettuato con successo', response);
          // Esegui eventuali azioni aggiuntive dopo il login
        },
        (error) => {
          // Gestisci gli errori dal server
          console.error('Errore durante il login', error);
        }
      );
  }

  
}
