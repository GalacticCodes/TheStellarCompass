import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AstrologyService } from '../../services/astrology.service';  // Update the path to your service
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-astro-table',
  templateUrl: './astro-table.component.html',
  styleUrls: ['./astro-table.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class AstroTableComponent implements OnChanges {
  @Input() date!: string; // Accept birth date from user input
  @Input() time!: string; // Accept birth time (UTC) from user input
  @Input() latitude!: number; // Accept birth latitude from user input
  @Input() longitude!: number; // Accept birth longitude from user input

  planetsData: any[] = [];  // To hold the planetary data
  ascendantPosition: number = 0;
  calculationTime: string = '';

  constructor(private astrologyService: AstrologyService) {}

  // React to changes in the inputs
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] || changes['time'] || changes['latitude'] || changes['longitude']) {
      // Call the method to calculate positions if any input changes
      this.calculatePositions();
    }
  }

  calculatePositions(): void {
    const requestData = {
      date: this.date,       // Use the input date
      time: this.time,       // Use the input time (UTC)
      latitude: this.latitude,  // Use the input latitude
      longitude: this.longitude // Use the input longitude
    };

    this.astrologyService.calculatePositions(requestData).subscribe(
      (response) => {
        this.planetsData = response.planets;  // Assuming response contains planets data
        this.ascendantPosition = response.ascendant.position;
        this.calculationTime = response.time;
      },
      (error) => {
        console.error('Error fetching planetary data:', error);
      }
    );
  }
}
