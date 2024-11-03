import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartComponent } from './components/base-chart/base-chart.component';
import { HousesComponent } from './components/houses/houses.component';
import { AspectsComponent } from './components/aspects/aspects.component';
import { PlanetComponent } from './components/planets/planets.component';
import { TransitsComponent } from './components/transits/transits.component';
import { CommonModule } from '@angular/common';
import { AstroTableComponent } from '../../../../layout/astro-table/astro-table.component';


@Component({
  selector: 'app-astro-chart',
  standalone: true,
  imports: [
    BaseChartComponent,
    HousesComponent,
    AspectsComponent,
    PlanetComponent,
    TransitsComponent,
    CommonModule,
    AstroTableComponent

],
  templateUrl: './astro-chart.component.html',
  styleUrls: ['./astro-chart.component.css']
})
export class AstroChartComponent implements OnChanges {
  @Input() name!: string;
  @Input() birthDate!: string;
  @Input() birthUtcTime!: string;
  @Input() birthLatitude!: number;
  @Input() birthLongitude!: number;
  @Input() birthTown!: string;

  isFormSubmitted = false;

 
  // React to changes in the inputs
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['birthDate'] || changes['birthUtcTime'] ||
      changes['birthLatitude'] || changes['birthLongitude'] ||
      changes['birthTown'] 
    ) {
      // Check if all required fields have a value and are not undefined
      if (
        this.birthDate && this.birthUtcTime &&
        this.birthLatitude && this.birthLongitude 
        
      ) {
        this.isFormSubmitted = true;  // Enable form submission state when all fields are provided
        console.log('Form Submitted: All required fields are present');
      } else {
        this.isFormSubmitted = false;
        console.log('Form Not Submitted: Missing required fields');
      }

      // Log the specific changes (optional)
      if (changes['birthDate']) {
        console.log('birthDate changed:', changes['birthDate'].currentValue);
      }
      if (changes['birthUtcTime']) {
        console.log('birthUtcTime changed:', changes['birthUtcTime'].currentValue);
      }
      if (changes['birthLatitude']) {
        console.log('birthLatitude changed:', changes['birthLatitude'].currentValue);
      }
      if (changes['birthLongitude']) {
        console.log('birthLongitude changed:', changes['birthLongitude'].currentValue);
      }
      if (changes['birthTown']) {
        console.log('birthTown changed:', changes['birthTown'].currentValue);
      }
    }
  }
}
