import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { AstrologyService } from '../../../../../../services/astrology.service';

@Component({
  selector: 'app-transits',
  template: '<svg id="transits-chart"></svg>',
  standalone: true,
  providers: [AstrologyService],
})
export class TransitsComponent implements OnInit, OnChanges {
  @Input() transitDate: string = '';  // Date from the transits legend, default is empty
  @Input() transitTime: string = '';  // Time for the transits, default is empty
  @Input() formData!: {
    birthDate: string;
    birthTime: string;
    birthLatitude: number;
    birthLongitude: number;
  };

  private width = 800;
  private height = 800;
  private radius = Math.min(this.width, this.height) / 2;
  private planets: any = {};
  private natalAscendant: number = 0;
  private transitAscendant: number = 0;

  constructor(private astrologyService: AstrologyService, private el: ElementRef) {}

  ngOnInit(): void {
    this.setDefaultDateTime();
    this.calculateNatalAscendant();
  }

  ngOnChanges(): void {
    if (this.formData) {
      this.calculateNatalAscendant();
    }
  }

  setDefaultDateTime(): void {
    if (!this.transitDate) {
      this.transitDate = new Date().toISOString().split('T')[0];  // Set today's date in yyyy-mm-dd format
    }

    if (!this.transitTime) {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = '00';  // Set seconds to zero
      this.transitTime = `${hours}:${minutes}:${seconds}`;
    }
  }

  calculateNatalAscendant(): void {
    const { birthDate, birthTime, birthLatitude, birthLongitude } = this.formData;

    this.astrologyService.calculatePositions({
      date: birthDate,
      time: birthTime,
      latitude: birthLatitude,
      longitude: birthLongitude,
    }).subscribe((data) => {
      this.natalAscendant = data.ascendant.position;
      this.calculateTransitAscendant();
    });
  }

  calculateTransitAscendant(): void {
    this.astrologyService.calculatePositions({
      date: this.transitDate,
      time: this.transitTime,
      latitude: this.formData.birthLatitude,
      longitude: this.formData.birthLongitude,
    }).subscribe((data) => {
      this.transitAscendant = data.ascendant.position;
      this.planets = data;  // Assign the entire response as the planets object
      this.renderTransits();
    });
  }

  renderTransits(): void {
    const svg = d3.select(this.el.nativeElement).select('#transits-chart');

    // Clear previous rendering
    svg.selectAll('*').remove();

    // Set up the SVG element and center it
    svg.attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')  // Ensure SVG scales correctly
      .classed('svg-content-responsive', true);  // Add class for custom styling

    // Append the <g> element and translate to the center of the SVG
    const g = svg.append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);  // Center the chart

  
    const planetRadius = this.radius * 0.95;  // Position for planets
  
    // Path to planet symbol images
    const planetImages = {
      sun: 'assets/transitPlanets/greenSun.png',
      moon: 'assets/transitPlanets/greenMoon.png',
      mercury: 'assets/transitPlanets/greenMercury.png',
      venus: 'assets/transitPlanets/greenVenus.png',
      mars: 'assets/transitPlanets/greenMars.png',
      jupiter: 'assets/transitPlanets/greenJupiter.png',
      saturn: 'assets/transitPlanets/greenSaturn.png',
      uranus: 'assets/transitPlanets/greenUranus.png',
      neptune: 'assets/transitPlanets/greenNeptune.png',
      pluto: 'assets/transitPlanets/greenPluto.png',
      chiron: 'assets/transitPlanets/greenChiron.png',
      northnode: 'assets/transitPlanets/greenNorthNode.png'
    };
  
    const signIndex = Math.floor(this.natalAscendant / 30);
  
    // Function to calculate the angle for each planet based on its degree
    const birthToTransit = (degree: number): number => {
      return ((signIndex * 30 + 180) - degree) * (Math.PI / 180);  // Adjust for 9 o'clock as the starting point
    };
  
    // Array to keep track of adjusted planet positions to avoid overlap
    const adjustedPlanets: { planet: string, angle: number }[] = [];
  
    // Function to check if two planets are within 3 degrees and adjust their angles
    const adjustPositionIfClose = (angle: number, planet: string): number => {
      for (const { planet: otherPlanet, angle: otherAngle } of adjustedPlanets) {
        const degreeDiff = Math.abs((angle - otherAngle) * (180 / Math.PI));  // Convert radian difference to degrees
        if (degreeDiff < 3) {
          // Adjust both planets in opposite directions to separate them
          angle += 0.05;  // Move current planet slightly forward
          return adjustPositionIfClose(angle, planet);  // Recursively check the new position
        }
      }
      adjustedPlanets.push({ planet, angle });  // Store the adjusted planet position
      return angle;
    };
  
    // Loop through each planet and plot its position, excluding 'ascendant' and 'midheaven'
    Object.keys(this.planets).forEach((planet) => {
      if (planet === 'ascendant' || planet === 'midheaven') return;  // Skip these
  
      const planetData = this.planets[planet];  // Get the planet's data
      const position = planetData.position;  // Get the degree of the planet
      const speed = planetData.speed;  // Get the speed of the planet
  
      let angleRad = birthToTransit(position);  // Convert degree to radians
  
      // Adjust the planet's position if it's too close to another planet
      angleRad = adjustPositionIfClose(angleRad, planet);
  
      // Log each planet's calculated position and angle
      console.log(`Rendering ${planet} at degree ${position} (adjusted angle ${angleRad})`);
  
      // Plot the planet image at the calculated angle
      g.append('image')
        .attr('x', planetRadius * Math.cos(angleRad) - 10)  // Adjust for image size (20x20)
        .attr('y', planetRadius * Math.sin(angleRad) - 10)
        .attr('width', 20)
        .attr('height', 20)
        .attr('href', planetImages[planet as keyof typeof planetImages]);
  
      // Add retrograde indicator (small "r") if the speed is negative
      if (speed < 0) {
        g.append('text')
          .attr('x', planetRadius * Math.cos(angleRad) + 9)  // Position near the planet symbol
          .attr('y', planetRadius * Math.sin(angleRad) + 9)  // Position slightly below the planet symbol
          .attr('text-anchor', 'start')
          .attr('dominant-baseline', 'middle')
          .style('font-size', '8px')
          .style('fill', 'green')
          .text('r');  // Retrograde indicator
      }
    });
  }
}
