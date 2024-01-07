import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private route: ActivatedRoute, private router: Router) { }

  isUserAuthenticated(): boolean {
    // Verifica se l'oggetto 'user_info' è presente nel local storage
    return localStorage.getItem('user_info') !== null;
  }

  logout() {
    // Rimuovi i dati dal local storage
    localStorage.removeItem('user_info');
    localStorage.removeItem('id');
    // Pulisci l'URL dall'access_token
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { access_token: null },
      queryParamsHandling: 'merge',
    });
  
    // Esegui la navigazione al componente di login
    this.router.navigate(['/login']);
  }
}
