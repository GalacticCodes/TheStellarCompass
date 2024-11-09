import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent implements OnInit {
  name: string = 'Matthew Charles Morgan';
  birthDate: string = '1997-09-19';
  birthLocalTime: string = '10:39';
  birthTown: string = 'Ridgewood, New Jersey';
  birthLatitude: number | null = 40.981;
  birthLongitude: number | null = -74.116;
  birthUtcTime: string = '';
  suggestions: any[] = [];
  errorMessage: string = ''; // Variable to store error message

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUtcTime();
  }

  // Fetch town suggestions
  onTownInput(event: any) {
    const input = event.target.value;
    if (input.length > 2) {
      this.getTownSuggestions(input);
    }
  }

  getTownSuggestions(input: string) {
    this.http.get(`http://localhost:5000/place-autocomplete?input=${input}`).subscribe((response: any) => {
      this.suggestions = response.predictions;
    });
  }

  selectTown(suggestion: any) {
    this.birthTown = suggestion.description;
    this.suggestions = [];
    this.getCoordinatesFromSelectedTown(suggestion.place_id);
  }

  getCoordinatesFromSelectedTown(placeId: string) {
    this.http.get(`http://localhost:5000/place-details?place_id=${placeId}`).subscribe((response: any) => {
      const location = response.result.geometry.location;
      this.birthLatitude = location.lat;
      this.birthLongitude = location.lng;
      this.getUtcTime();
    });
  }

  getUtcTime() {
    const [year, month, day] = this.birthDate.split('-').map(Number);
    const [hours, minutes] = this.birthLocalTime.split(':').map(Number);
    const localDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));

    this.http.get(`http://localhost:5000/timezone?latitude=${this.birthLatitude}&longitude=${this.birthLongitude}`)
      .subscribe((data: any) => {
        if (data.status === 'OK') {
          const totalOffsetInMilliseconds = (data.rawOffset + data.dstOffset) * 1000;
          const utcDateTime = new Date(localDateTime.getTime() - totalOffsetInMilliseconds);
          this.birthUtcTime = utcDateTime.toISOString().split('T')[1].substring(0, 5);
        } else {
          console.error('Timezone API Error:', data);
        }
      }, (error) => {
        console.error('HTTP Error:', error);
      });
  }

  @Output() formSubmitted = new EventEmitter<{
    name: string;
    date: string;
    localTime: string;
    utcTime: string;
    town: string;
    latitude: number | null;
    longitude: number | null;
  }>();

  onSubmit() {
    const missingFields = [];

    if (!this.name) missingFields.push('Name');
    if (!this.birthDate) missingFields.push('Birth Date');
    if (!this.birthLocalTime) missingFields.push('Birth Local Time');
    if (!this.birthUtcTime) missingFields.push('UTC Time');
    if (!this.birthTown) missingFields.push('Birth Town');
    if (this.birthLatitude === null) missingFields.push('Latitude');
    if (this.birthLongitude === null) missingFields.push('Longitude');

    if (missingFields.length === 0) {
      // Use the non-null assertion operator (!) to assure TypeScript that these values are not null
      this.formSubmitted.emit({
        name: this.name,
        date: this.birthDate,
        localTime: this.birthLocalTime,
        utcTime: this.birthUtcTime,
        town: this.birthTown,
        latitude: parseFloat(this.birthLatitude!.toFixed(3)),  // Non-null assertion
        longitude: parseFloat(this.birthLongitude!.toFixed(3)) // Non-null assertion
      });
      this.errorMessage = ''; // Clear error message on successful submission
    } else {
      // Set detailed error message with missing fields
      this.errorMessage = `Form not submitted: Missing required fields - ${missingFields.join(', ')}.`;
    }
  }

}
