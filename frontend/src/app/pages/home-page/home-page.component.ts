import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  constructor(private http: HttpClient) { }

  getData() {
    this.http
      .get('http://localhost:3000/api/v1/animals')
      .subscribe(
        data => {
          // handle the data
          console.log(data);
        },
        error => {
          // handle the error
        }
      );
  }
}
