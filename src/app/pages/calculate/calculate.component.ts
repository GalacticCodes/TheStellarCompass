import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInputComponent } from './components/user-input/user-input.component';
import { AstroChartComponent } from './components/astro-chart/astro-chart.component';
import { GalaxyCanvasComponent } from '../../layout/galaxy-canvas/galaxy-canvas.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [
    CommonModule, 
    UserInputComponent, 
    AstroChartComponent,
    GalaxyCanvasComponent, HttpClientModule
  ],
  templateUrl: './calculate.component.html',
  styleUrls: ['./calculate.component.css']
})
export class CalculateComponent {
  // Store the form data
  formData!: {
    name: string;
    date: string;
    localTime: string;
    utcTime: string;
    town: string;
    latitude: number | null;
    longitude: number | null;
  };

  showChart = false;

  // Method to capture form submission data from UserInputComponent
  onFormSubmitted(formData: { 
    name: string, 
    date: string, 
    localTime: string, 
    utcTime: string, 
    town: string, 
    latitude: number | null, 
    longitude: number | null 
  }) {
    // Ensure latitude and longitude are numbers, default to 0 if null
    this.formData = {
      ...formData,
      latitude: formData.latitude ?? 0,
      longitude: formData.longitude ?? 0
    };
    
    // Set flag to show the chart and aspects
    this.showChart = true;
  }
}

