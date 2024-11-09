import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AstrologyService {

  constructor(private http: HttpClient) {}

  
  calculatePositions(data: { date: string, time: string, latitude: number, longitude: number }): Observable<any> {
    // Call the backend API to calculate both the positions and speeds of planets
    return this.http.post('http://localhost:5000/calculate-positions', data);
  }
}

