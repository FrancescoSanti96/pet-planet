import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FollowerService {
    private apiUrl = 'http://localhost:3000/api/v1';

    constructor(private http: HttpClient) { }

    private id = localStorage.getItem('id');

    getFollowers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/followers/user/${this.id}`)
    }

    addFollower(utenteId: string, amico: string): Observable<any> {
        const body = { utente: utenteId, amico: amico };
        return this.http.post<any>(`${this.apiUrl}/followers`, body);
      }
      

    removeFollower(followId: string, email: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/followers/user/${followId}/email/${email}`);
    }
}