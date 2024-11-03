import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalaxyCanvasComponent } from "../galaxy-canvas/galaxy-canvas.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, GalaxyCanvasComponent]

})
export class NavbarComponent {
  isMenuActive = false;

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }
}
