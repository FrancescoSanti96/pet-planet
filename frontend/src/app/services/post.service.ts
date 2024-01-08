import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../model/post.model';

@Injectable({
    providedIn: 'root',
})
export class PostService {
    private apiUrl = 'http://localhost:3000/api/v1';

    constructor(private http: HttpClient) { }

    private id = localStorage.getItem('id');

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiUrl}/posts`);
    }

    getPostByUserID(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/posts/${this.id}/user`);
    }

    createPost(utente: string, titolo: string, corpo: string): Observable<Post> {
        const postData = { utente, titolo, corpo };
        return this.http.post<Post>(`${this.apiUrl}/posts`, postData);
    }
    
    createComment(postId: string, commentData: { utente: string; testo: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/posts/${postId}/comment`, commentData);
    }

    getComments(postId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/posts/${postId}/comments`);
    }

    deleteComment(postId: string, commentId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/posts/${postId}/comments/${commentId}`);
    }
}
