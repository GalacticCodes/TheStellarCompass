import { Component, Output, EventEmitter } from '@angular/core';
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
export class UserInputComponent {
  name: string = ''; // No pre-load
  gender: string = ''; // No pre-load
  birthDate: string = ''; // No pre-load
  birthLocalTime: string = ''; // No pre-load
  birthTown: string = ''; // No pre-load
  birthLatitude: number | null = null; // No pre-load
  birthLongitude: number | null = null; // No pre-load
  birthUtcTime: string = ''; // No pre-load
  suggestions: any[] = [];

  constructor(private http: HttpClient) {}

  // Fetch town suggestions (already using Flask for this)
  onTownInput(event: any) {
    const input = event.target.value;
    if (input.length > 2) {
      this.getTownSuggestions(input);
    }
  }

  getTownSuggestions(input: string) {
    this.http.get(`https://api.thestellarcompass.com/place-autocomplete?input=${input}`).subscribe((response: any) => {
      this.suggestions = response.predictions;
    });
  }

  // Select a town and fetch details from Flask API
  selectTown(suggestion: any) {
    this.birthTown = suggestion.description;
    this.suggestions = [];
    
    // Get the latitude and longitude of the selected town
    this.getCoordinatesFromSelectedTown(suggestion.place_id);
  }

  // Updated to call Flask API for place details
  getCoordinatesFromSelectedTown(placeId: string) {
    this.http.get(`https://api.thestellarcompass.com/place-details?place_id=${placeId}`).subscribe((response: any) => {
      const location = response.result.geometry.location;
      this.birthLatitude = location.lat;
      this.birthLongitude = location.lng;

      // Calculate UTC time once we have the coordinates
      this.getUtcTime();
    });
  }

  getUtcTime() {
    // Break down birthDate and birthLocalTime into components for the Date.UTC constructor
    const [year, month, day] = this.birthDate.split('-').map(Number);
    const [hours, minutes] = this.birthLocalTime.split(':').map(Number);
    
    // Construct a Date object in UTC using Date.UTC (Note: month is 0-indexed, so subtract 1)
    const localDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    console.log('Local DateTime in UTC:', localDateTime);
    
    // API request to get timezone offset information based on latitude and longitude
    this.http.get(`https://api.thestellarcompass.com/timezone?latitude=${this.birthLatitude}&longitude=${this.birthLongitude}`)
      .subscribe((data: any) => {
        if (data.status === 'OK') {
          const rawOffset = data.rawOffset;   // Standard time zone offset in seconds
          const dstOffset = data.dstOffset;   // Daylight saving time offset in seconds (if applicable)
          const totalOffsetInSeconds = rawOffset + dstOffset; // Calculate total offset from UTC
          
          console.log('Raw Offset (seconds):', rawOffset);
          console.log('DST Offset (seconds):', dstOffset);
          console.log('Total Offset (seconds):', totalOffsetInSeconds);
          
          // Convert total offset into milliseconds
          const totalOffsetInMilliseconds = totalOffsetInSeconds * 1000;
          
          // Adjust localDateTime to UTC by subtracting the total offset to get UTC time
          const utcDateTime = new Date(localDateTime.getTime() - totalOffsetInMilliseconds);
          console.log('UTC Date Time:', utcDateTime.toUTCString());  // Debugging: Print the UTC DateTime
          
          // Extract and format the UTC time in 'HH:MM' format
          this.birthUtcTime = utcDateTime.toISOString().split('T')[1].substring(0, 5);
          
          // Print the formatted UTC time for debugging
          console.log('Formatted UTC Time (HH:MM):', this.birthUtcTime);  // Final UTC time
        } else {
          // Handle API error response
          console.error('Timezone API Error:', data);
        }
      }, (error) => {
        // Handle HTTP request error
        console.error('HTTP Error:', error);
      });
  }
  
  
  // Define an EventEmitter to emit the form data
  @Output() formSubmitted = new EventEmitter<{
    name: string;
    gender: string;
    date: string;
    localTime: string;
    utcTime: string;
    town: string;
    latitude: number | null;
    longitude: number | null;
  }>();

  onSubmit() {
    // Emit the form data when the form is submitted, rounding latitude/longitude and trimming time to minutes
    this.formSubmitted.emit({
      name: this.name,
      gender: this.gender,
      date: this.birthDate,
      localTime: this.birthLocalTime,
      utcTime: this.birthUtcTime,  // UTC time trimmed to HH:MM
      town: this.birthTown,
      latitude: this.birthLatitude ? parseFloat(this.birthLatitude.toFixed(3)) : null,  // Round to 3 decimal places
      longitude: this.birthLongitude ? parseFloat(this.birthLongitude.toFixed(3)) : null  // Round to 3 decimal places
    });
  }
}
