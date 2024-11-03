import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor(private http: HttpClient) {}

  getCoordinates(town: string): Observable<any> {
    const apiKey = 'AIzaSyBB0U7PyVbkGamuDtkILADCtadtUX-WTAw'; // Replace with your actual Google API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(town)}&key=${apiKey}`;

    return this.http.get(url).pipe(
      map((data: any) => {
        if (data && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          return {
            lat: location.lat,
            lng: location.lng
          };
        } else {
          throw new Error('Town not found');
        }
      })
    );
  }
}
