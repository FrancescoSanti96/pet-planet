import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {


  constructor(private http: HttpClient) { }

  getData() {
    this.http
    .get('https://jsonplaceholder.typicode.com/todos/1')
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
