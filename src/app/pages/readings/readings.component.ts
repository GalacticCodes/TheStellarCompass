import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalaxyCanvasComponent } from '../../layout/galaxy-canvas/galaxy-canvas.component';
import { FaqComponent } from '../../layout/faq/faq.component';

@Component({
  selector: 'app-readings',
  templateUrl: './readings.component.html',
  styleUrls: ['./readings.component.css'],
  standalone: true,  // Declare it as a standalone component
  imports: [ CommonModule, GalaxyCanvasComponent, FaqComponent],  // Add FormsModule and HttpClientModule
})
export class ReadingsComponent  {
  
}
