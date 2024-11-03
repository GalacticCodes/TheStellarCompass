import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SynastryService {
  private apiUrl = 'http://localhost:5000/api/synastry-dates'; // Flask API URL

  constructor(private http: HttpClient) {}

  // Method to fetch available dates from Flask API
  getAvailableDates(): Observable<{ availableDates: string[] }> {
    return this.http.get<{ availableDates: string[] }>(this.apiUrl).pipe(
      tap(data => console.log('Fetched available dates:', data.availableDates)) // Log the data to the console
    );
  }
}
