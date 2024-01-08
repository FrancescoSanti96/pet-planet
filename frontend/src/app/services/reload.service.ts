import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReloadService {
  reloadPage(): void {
    window.location.reload();
  }
}
