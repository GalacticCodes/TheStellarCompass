import { Component } from '@angular/core';
import { GalaxyCanvasComponent } from '../../layout/galaxy-canvas/galaxy-canvas.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [GalaxyCanvasComponent, CommonModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

}

