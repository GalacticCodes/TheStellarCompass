import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { AstrologyService } from '../../../../../../services/astrology.service';

@Component({
  selector: 'app-planets',
  template: '<svg id="planets-chart"></svg>',
  standalone: true,
  providers: [AstrologyService]
})
export class PlanetComponent implements OnChanges {
  @Input() formData!: {
    birthDate: string;
    birthTime: string;
    birthLatitude: number;
    birthLongitude: number;
  };

  private ascendant!: number;
  private width = 800;
  private height = 800;
  private radius = Math.min(this.width, this.height) / 2;
  private planets: any = {};

  constructor(private el: ElementRef, private astrologyService: AstrologyService) {}

  ngOnChanges(): void {
    if (this.formData) {
      const { birthDate, birthTime, birthLatitude, birthLongitude } = this.formData;
      this.fetchPlanetsAndRender(birthDate, birthTime, birthLatitude, birthLongitude);
    }
  }

  fetchPlanetsAndRender(birthDate: string, birthTime: string, birthLatitude: number, birthLongitude: number): void {
    this.astrologyService.calculatePositions({
      date: birthDate,
      time: birthTime,
      latitude: birthLatitude,
      longitude: birthLongitude
    })
    .subscribe((data) => {
      console.log('Planetary Data:', data);  // Print the received data from the API
      this.ascendant = data.ascendant.position;  // Store the Ascendant position
      this.planets = data;  // Store the planetary positions and speeds
      this.renderPlanets();  // Render the planets once the data is retrieved
    });
  }

  
  renderPlanets(): void {
    const svg = d3.select(this.el.nativeElement).select('#planets-chart');

    // Clear previous rendering
    svg.selectAll('*').remove();

    // Set up the SVG element and center it
    svg.attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')  // Ensure SVG scales correctly
      .classed('svg-content-responsive', true);  // Add class for custom styling

    // Append the <g> element and translate to the center of the SVG
    const g = svg.append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);  // Center the chart

    const planetRadius = this.radius * 0.68;  // Base position for the planets
    const tickRadius = this.radius * 0.75;    // Tick marks for planets
    const degreeRadius = this.radius * 0.63;  // Position for the degree in the house
  
    // Array of image file paths for planet symbols
    const planetImages: { [key: string]: string } = {
      sun: 'assets/planets/sun.png',
      moon: 'assets/planets/moon.png',
      mercury: 'assets/planets/mercury.png',
      venus: 'assets/planets/venus.png',
      mars: 'assets/planets/mars.png',
      jupiter: 'assets/planets/jupiter.png',
      saturn: 'assets/planets/saturn.png',
      uranus: 'assets/planets/uranus.png',
      neptune: 'assets/planets/neptune.png',
      pluto: 'assets/planets/pluto.png',
      midheaven: 'assets/planets/mc.png',
      northnode: 'assets/planets/northnode.png',
      chiron: 'assets/planets/chiron.png',
      ascendant: 'assets/planets/ac.png'
    };
  
    const signIndex = Math.floor(this.ascendant / 30);
  
    // Function to calculate the angle for each planet based on its degree
    const degreeToAngle = (degree: number): number => {
      return ((signIndex * 30 + 180) - degree) * (Math.PI / 180);  // Adjust for 9 o'clock as the starting point
    };
  
    // Plot each planet based on its degree
    Object.keys(this.planets).forEach((planet) => {
      const planetData = this.planets[planet];
      const planetPosition = planetData.position;  // Original degree of the planet
      const speed = planetData.speed;  // Get the speed of the planet
  
      // Convert the original position to an angle for rendering
      const angleRad = degreeToAngle(planetPosition);
  
      // Plot bold tick mark at the planet's original degree position
      g.append('line')
        .attr('x1', tickRadius * Math.cos(angleRad))  // Original position for tick
        .attr('y1', tickRadius * Math.sin(angleRad))
        .attr('x2', (tickRadius - 10) * Math.cos(angleRad))  // Extend the tick slightly outward
        .attr('y2', (tickRadius - 10) * Math.sin(angleRad))
        .attr('stroke', 'purple')
        .attr('stroke-width', 2);  // Bold line for the tick mark
  
      // Calculate the original x, y position of the planet
      const x = planetRadius * Math.cos(angleRad);
      const y = planetRadius * Math.sin(angleRad);
  
      // Assert that `planet` is one of the keys of planetImages
      const imagePath = planetImages[planet as keyof typeof planetImages];
  
      // Plot planet images at the calculated position
      g.append('image')
        .attr('x', x - 15)  // Adjust x for centering the image
        .attr('y', y - 15)  // Adjust y for centering the image
        .attr('width', 20)  // Image width
        .attr('height', 20)  // Image height
        .attr('href', imagePath);
  
      // Extract degrees and minutes
      const degreeInHouse = Math.floor(planetPosition % 30);
      const minutesInHouse = Math.round((planetPosition % 1) * 60);
  
      // Plot the degree and minutes at .62 radius with simulated superscript
      const degreeGroup = g.append('g')
        .attr('transform', `translate(${degreeRadius * Math.cos(angleRad)}, ${degreeRadius * Math.sin(angleRad)})`);
  
      // Add degree as the main text
      degreeGroup.append('text')
        .attr('text-anchor', degreeInHouse < 10 ? 'right' : 'middle')  // Right align for single digits
        .attr('dominant-baseline', 'middle')
        .style('font-size', '10px')
        .text(`${degreeInHouse}`);
  
      // Add retrograde symbol (R) if the planet speed is negative
      if (speed < 0) {
        g.append('text')
          .attr('x', x + 9)  // Position near the planet symbol
          .attr('y', y + 9)  // Position slightly below the planet symbol
          .attr('text-anchor', 'start')
          .attr('dominant-baseline', 'middle')
          .style('font-size', '9px')
          .text('r');  // Retrograde indicator
      }
    });
  }
}
