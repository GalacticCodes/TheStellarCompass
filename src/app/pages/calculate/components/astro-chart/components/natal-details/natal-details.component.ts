import { Component, Input, OnInit } from '@angular/core';
import { AstrologyService } from '../../../../../../services/astrology.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-natal-details',
  templateUrl: './natal-details.component.html',
  styleUrls: ['./natal-details.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class NatalDetailsComponent implements OnInit {
  @Input() formData!: {
    birthDate: string;
    birthTime: string;
    birthLatitude: number;
    birthLongitude: number;
  };

  natalPositions: { [key: string]: { position: string; degree: number } } = {};
  transitPositions: { [key: string]: { position: string; degree: number } } = {};

  planets = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter',
    'Saturn', 'Uranus', 'Neptune', 'Pluto', 'North Node', 'South Node'
  ];

  constructor(private astrologyService: AstrologyService) {}

  ngOnInit(): void {
    if (this.formData) {
      const { birthDate, birthTime, birthLatitude, birthLongitude } = this.formData;
      
      // Fetch natal and transit positions
      this.fetchNatalPositions(birthDate, birthTime, birthLatitude, birthLongitude);
      this.fetchTransitPositions();
    }
  }

  fetchNatalPositions(birthDate: string, birthTime: string, birthLatitude: number, birthLongitude: number): void {
    this.astrologyService.calculatePositions({
      date: birthDate,
      time: birthTime,
      latitude: birthLatitude,
      longitude: birthLongitude
    })
    .subscribe((data) => {
      console.log('Natal Data:', data);  // Log natal data for debugging
      this.natalPositions = data;  // Store natal data
    });
  }

  fetchTransitPositions(): void {
    // Get the current date and time
    const now = new Date();
    const date = now.toISOString().split('T')[0];  // Format as YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0];  // Format as HH:MM:SS
  
    // Get user's location (latitude and longitude) using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
  
        this.astrologyService.calculatePositions({ date, time, latitude, longitude })
          .subscribe((data) => {
            console.log('Transit Data:', data);  // Log transit data for debugging
            this.transitPositions = data;        // Store transit data
          });
      },
      (error) => {
        console.error('Error fetching location:', error);
        // Handle error (e.g., use default location or notify the user)
      }
    );
  }
  
  
}
