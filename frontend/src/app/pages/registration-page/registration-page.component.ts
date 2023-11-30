import { Component } from '@angular/core';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss'
})
export class RegistrationPageComponent {
  datiRegistrazione = {
    nome: '',
    dataNascita: '',
    tipoAnimale: '',
    sesso: '',
    razza: '',
    taglia: '',
    peso: '',
    nomeUtente: '',
    password: ''
  };
  constructor(private authService: AuthService) { }

  registrati() {
    this.authService.registrazioneUtente(this.datiRegistrazione).subscribe(response => {
      console.log(response);
    });
  }
}
