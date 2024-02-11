import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ReloadService } from '../../services/reload.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  userInfo: any;
  img!: SafeUrl;
  isVisible: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private sanitizer: DomSanitizer,
    private reloadService: ReloadService
    ) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.isUserAuthenticated()) {
        this.loadUserInfo();
      }
    }, 200)
  }

  loadUserInfo(): void {
    this.userInfo = JSON.parse(localStorage.getItem('user_info')!);
    this.img = this.sanitizer.bypassSecurityTrustUrl(this.userInfo.picture);
    this.isVisible = true;
  }

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
