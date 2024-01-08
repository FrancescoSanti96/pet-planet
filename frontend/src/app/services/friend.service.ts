import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FriendService {
    private apiUrl = 'http://localhost:3000/api/v1';

    constructor(private http: HttpClient) { }

    private id = localStorage.getItem('id');

    getFriends(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/friends/user/${this.id}`)
            .pipe(
                tap(friends => console.log('Friends from API:', friends))
            );
    }

    followFriend(friendId: string, followStatus: boolean): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/friends/${friendId}/follow`, { followStatus });
    }

    unfollow(followId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/friends/user/${followId}`);
    }
}