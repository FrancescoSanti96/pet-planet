import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/v1/users';

    constructor(private http: HttpClient) { }

    registrazioneUtente(dati: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/registrazione`, dati);
    }

    accessoUtente(credenziali: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/accesso`, credenziali);
    }
}
