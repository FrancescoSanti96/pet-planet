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

    getPostsOfFriends(userId: string): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiUrl}/posts/${userId}/friends`);
    }

    getPostByUserID(userId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/posts/${userId}/user`);
    }

    createPost(utente: string, titolo: string, corpo: string, profilePic: string): Observable<Post> {
        const postData = { utente, titolo, corpo,  profilePic };
        return this.http.post<Post>(`${this.apiUrl}/posts`, postData);
    }

    modifyPost(postId: string, updatedData: { titolo: string; corpo: string }): Observable<Post> {
        return this.http.put<Post>(`${this.apiUrl}/posts/${postId}`, updatedData);
    }

    deletePost(postId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/posts/${postId}`);
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
