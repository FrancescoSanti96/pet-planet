import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  hidePassword: boolean = true;

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  constructor(private router: Router) { }

  navigateToRegistration() {
    this.router.navigate(['/register']);
  }

  login(): void {
    // Implementa la tua logica di login qui, ad esempio:
    if (this.username === 'utente' && this.password === 'password') {
      console.log('Login riuscito!');
      // Aggiungi il codice per reindirizzare l'utente o eseguire altre azioni dopo il login
    } else {
      console.log('Credenziali non valide. Riprova.');
      // Aggiungi il codice per gestire un tentativo di login non valido
    }
  }
}
