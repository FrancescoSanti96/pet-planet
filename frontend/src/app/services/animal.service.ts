import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal } from '../model/animal.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private apiUrl = 'http://localhost:3000/api/v1'; 

  private id = localStorage.getItem('id');

  constructor(private http: HttpClient) {}

  getAllAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/animals`);
  }

  getAnimalById(animalId: string): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/animals/${animalId}`);
  }

  getAnimalByUserId(): Observable<Animal | null> {
    return this.http.get<Animal | null>(`${this.apiUrl}/animals/user/${this.id}`);
  }

  createAnimal(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(`${this.apiUrl}/animals`, animal);
  }

  updateAnimal(animalId: string, updatedData: Partial<Animal>): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/animals/${animalId}`, updatedData);
  }

  deleteAnimal(animalId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/animals/${animalId}`);
  }
}
