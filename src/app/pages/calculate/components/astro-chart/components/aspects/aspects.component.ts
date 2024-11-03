import { Component, Input, OnChanges, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { AstrologyService } from '../../../../../../services/astrology.service';
import { HttpClientModule } from '@angular/common/http';

interface PlanetData {
  position: number;
  speed: number;
}

interface PlanetaryPositions {
  [key: string]: PlanetData;  // Key can be 'sun', 'moon', etc.
}

@Component({
  selector: 'app-aspects',
  template: '<svg id="aspects-chart" class="aspects-chart"></svg>',
  standalone: true,
  providers: [AstrologyService],
  imports: [HttpClientModule],
})
export class AspectsComponent implements OnChanges {
  @Input() formData!: {
    birthDate: string;
    birthTime: string;
    birthLatitude: number;
    birthLongitude: number;
  };

  private width = 800;
  private height = 800;
  private radius = Math.min(this.width, this.height) / 2;
  private planets: PlanetaryPositions = {};  // Define the correct type for planets

  constructor(private el: ElementRef, private astrologyService: AstrologyService) {}

  ngOnChanges(): void {
    if (this.formData) {
      const { birthDate, birthTime, birthLatitude, birthLongitude } = this.formData;
      this.fetchPlanetsAndRenderTicks(birthDate, birthTime, birthLatitude, birthLongitude);
    }
  }

  fetchPlanetsAndRenderTicks(birthDate: string, birthTime: string, birthLatitude: number, birthLongitude: number): void {
    this.astrologyService.calculatePositions({
      date: birthDate,
      time: birthTime,
      latitude: birthLatitude,
      longitude: birthLongitude,
    }).subscribe((data: PlanetaryPositions) => {
      this.planets = data;  // Store planetary positions
      console.log('Planetary Positions:', this.planets);  // Debugging log
      this.renderTicks();  // Render tick marks for each planet
      this.drawAspects();  // Draw conjunction, square, opposition, sextile, and trine lines
    });
  }

  // Function to render tick marks for each planet
  renderTicks(): void {
    const svg = d3.select(this.el.nativeElement).select('#aspects-chart')
      .attr('preserveAspectRatio', 'xMinYMin meet')  // Ensure aspect ratio is preserved
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)  // Set the responsive viewBox
      .classed('svg-content-responsive', true)  // Add class for custom styling
      .html('')  // Clear previous elements
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);  // Center the chart

    const planetRadius = this.radius * 0.55;  // Position for tick marks

    // Fetch the ascendant from the planets object
    const ascendant = this.planets['ascendant']?.position || 0;  // Default to 0 if ascendant is not found

    const signIndex = Math.floor(ascendant / 30);  // Calculate sign index using the ascendant

    // Function to calculate the angle for each planet based on its degree
    const degreeToAngle = (degree: number): number => {
      return ((signIndex * 30 + 180) - degree) * (Math.PI / 180);  // Adjust for 9 o'clock as the starting point
    };

    Object.keys(this.planets).forEach((planet) => {
      // Exclude ascendant, midheaven, chiron, and north node
      if (planet !== 'ascendant' && planet !== 'midheaven' && planet !== 'chiron' && planet !== 'northnode') {
        const planetPosition = this.planets[planet]?.position as number;  // Cast to number
        const angleRad = degreeToAngle(planetPosition);

        // Draw a tick mark at each planet's position
        this.drawTickMark(svg, angleRad, planetRadius);
      }
    });
  }

  // Function to draw tick mark at a given angle and radius
  drawTickMark(svg: any, angleRad: number, radius: number): void {
    const tickLength = 5;
    svg.append('line')
      .attr('x1', radius * Math.cos(angleRad))
      .attr('y1', radius * Math.sin(angleRad))
      .attr('x2', (radius - tickLength) * Math.cos(angleRad))
      .attr('y2', (radius - tickLength) * Math.sin(angleRad))
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
  }

  // Function to draw conjunctions, squares (90 degrees), oppositions (180 degrees), sextiles (60 degrees), and trines (120 degrees)
  drawAspects(): void {
    const svg = d3.select(this.el.nativeElement).select('#aspects-chart g');  // Select the main <g> element
    const planetRadius = this.radius * 0.54;  // Position for tick marks

    // Fetch the ascendant from the planets object
    const ascendant = this.planets['ascendant']?.position || 0;  // Default to 0 if ascendant is not found

    const signIndex = Math.floor(ascendant / 30);  // Calculate sign index using the ascendant

    // Function to calculate the angle for each planet based on its degree
    const degreeToAngle = (degree: number): number => {
      return ((signIndex * 30 + 180) - degree) * (Math.PI / 180);  // Adjust for 9 o'clock as the starting point
    };

    const planetEntries = Object.entries(this.planets).filter(([planet]) => planet !== 'ascendant' && planet !== 'midheaven' && planet !== 'chiron' && planet !== 'northnode');

    // Loop through all pairs of planets
    for (let i = 0; i < planetEntries.length; i++) {
      for (let j = i + 1; j < planetEntries.length; j++) {
        const [planet1, { position: position1 }] = planetEntries[i];
        const [planet2, { position: position2 }] = planetEntries[j];

        // Calculate the angular difference between the two planets
        const angleDiff = Math.abs((position1 as number) - (position2 as number));
        const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);  // Ensure we handle angles that wrap around 360

        // Aspect logic
        if (normalizedDiff <= 10) {  // Conjunction (within 10 degrees)
          console.log(`${planet1} and ${planet2} are in conjunction`);
          this.drawAspectLine(svg, planetRadius, position1 as number, position2 as number, 'red');
        } else if (Math.abs(normalizedDiff - 90) <= 10) {  // Square (within 10 degrees of 90 degrees)
          console.log(`${planet1} and ${planet2} are in square`);
          this.drawAspectLine(svg, planetRadius, position1 as number, position2 as number, 'red');
        } else if (Math.abs(normalizedDiff - 180) <= 10) {  // Opposition (within 10 degrees of 180 degrees)
          console.log(`${planet1} and ${planet2} are in opposition`);
          this.drawAspectLine(svg, planetRadius, position1 as number, position2 as number, 'red');
        } else if (Math.abs(normalizedDiff - 60) <= 10) {  // Sextile (within 10 degrees of 60 degrees)
          console.log(`${planet1} and ${planet2} are in sextile`);
          this.drawAspectLine(svg, planetRadius, position1 as number, position2 as number, 'blue');
        } else if (Math.abs(normalizedDiff - 120) <= 10) {  // Trine (within 10 degrees of 120 degrees)
          console.log(`${planet1} and ${planet2} are in trine`);
          this.drawAspectLine(svg, planetRadius, position1 as number, position2 as number, 'blue');
        }
      }
    }
  }

  // Function to draw aspect lines between two planets
  drawAspectLine(svg: any, planetRadius: number, position1: number, position2: number, color: string): void {
    const ascendant = this.planets['ascendant']?.position || 0;
    const signIndex = Math.floor(ascendant / 30);

    const degreeToAngle = (degree: number): number => {
      return ((signIndex * 30 + 180) - degree) * (Math.PI / 180);  // Adjust for 9 o'clock as the starting point
    };

    const angleRad1 = degreeToAngle(position1);
    const angleRad2 = degreeToAngle(position2);

    // Draw line between the two planets' tick marks
    svg.append('line')
      .attr('x1', planetRadius * Math.cos(angleRad1))
      .attr('y1', planetRadius * Math.sin(angleRad1))
      .attr('x2', planetRadius * Math.cos(angleRad2))
      .attr('y2', planetRadius * Math.sin(angleRad2))
      .attr('stroke', color)
      .attr('stroke-width', 1);
  }
}
