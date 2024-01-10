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
    return localStorage.getItem('user_info') !== null;
  }

  logout() {
    localStorage.removeItem('user_info');
    localStorage.removeItem('id');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { access_token: null },
      queryParamsHandling: 'merge',
    });
  
    this.router.navigate(['/login']);
  }
}
