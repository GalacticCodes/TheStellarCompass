import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { AstrologyService } from '../../services/astrology.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { UserInputComponent } from '../calculate/components/user-input/user-input.component';
import { GalaxyCanvasComponent } from '../../layout/galaxy-canvas/galaxy-canvas.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, HttpClientModule, UserInputComponent, GalaxyCanvasComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AstrologyService]
})
export class HomeComponent {

}
