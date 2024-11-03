import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { AstrologyService } from '../../../../../../services/astrology.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-houses',
  template: '<svg id="houses-chart"></svg>',
  standalone: true,
  imports: [HttpClientModule],  // Add HttpClientModule here
  providers: [AstrologyService], // Add AstrologyService as a provider
})
export class HousesComponent implements OnChanges {
  @Input() formData!: {
    birthDate: string;
    birthTime: string;
    birthLatitude: number;
    birthLongitude: number;
  };
  
  private ascendant!: number;
  private width = 800;  // Set width for the chart
  private height = 800;  // Set height for the chart
  private radius = Math.min(this.width, this.height) / 2;  // Chart radius

  constructor(private el: ElementRef, private astrologyService: AstrologyService) {}

  ngOnChanges(): void {
    if (this.formData) {
      const { birthDate, birthTime, birthLatitude, birthLongitude } = this.formData;
      this.fetchAscendantAndRender(birthDate, birthTime, birthLatitude, birthLongitude);
    }
  }

  fetchAscendantAndRender(birthDate: string, birthTime: string, birthLatitude: number, birthLongitude: number): void {
    this.astrologyService.calculatePositions({
      date: birthDate,  // Use the birthDate passed from formData
      time: birthTime,  // Use the birthTime passed from formData
      latitude: birthLatitude,  // Use the birthLatitude passed from formData
      longitude: birthLongitude  // Use the birthLongitude passed from formData
    }).subscribe((data) => {
      this.ascendant = data.ascendant.position;  // Store the Ascendant
      console.log('Ascendant Degree:', this.ascendant);  // Print to the console
      this.renderHousesAndAscendant();  // Render the Ascendant and houses
    });
  }

  renderHousesAndAscendant(): void {
    const svg = d3.select(this.el.nativeElement).select('#houses-chart')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)  // Set the responsive viewBox
      .attr('preserveAspectRatio', 'xMidYMid meet')  // Ensure SVG scales correctly
      .classed('svg-content-responsive', true)  // Add class for custom styling

    // Clear previous rendering
    svg.selectAll('*').remove();

    // Append the <g> element and translate to the center of the SVG
    const g = svg.append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);  // Center the chart


    const ascendantRadius = this.radius * 0.68;  // Position for the Ascendant image
    const tickRadius = this.radius * 0.75;  // Tick marks for planets (previously in PlanetComponent)
    const degreeRadius = this.radius * 0.59;  // Position for the degree in the house
    const midRadius = this.radius * 0.82;        // Position for the zodiac images

      
    // Array of image file paths for zodiac symbols
    const zodiacImages: { [key: string]: string } = {
      aries: 'assets/zodiac/aries.png',
      taurus: 'assets/zodiac/taurus.png',
      gemini: 'assets/zodiac/gemini.png',
      cancer: 'assets/zodiac/cancer.png',
      leo: 'assets/zodiac/leo.png',
      virgo: 'assets/zodiac/virgo.png',
      libra: 'assets/zodiac/libra.png',
      scorpio: 'assets/zodiac/scorpio.png',
      sagittarius: 'assets/zodiac/sagittarius.png',
      capricorn: 'assets/zodiac/capricorn.png',
      aquarius: 'assets/zodiac/aquarius.png',
      pisces: 'assets/zodiac/pisces.png'
    };

    // Array of zodiac signs for indexing
    const zodiacSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

    // Calculate the number of the sign and the degrees within that sign
    const signIndex = Math.floor(this.ascendant / 30);  // Integer part (0-11, for 12 zodiac signs)
  

    // Print which sign is in the first house
    console.log(`The sign in the first house is ${zodiacSigns[signIndex]}.`);

    // Calculate the angle for the Ascendant
    const ascendantAngle = (this.ascendant % 30) * (Math.PI / 180);

    // Now render the rest of the zodiac signs for the other houses
    const houseAngles = d3.range(0, 2 * Math.PI, Math.PI / 6);  // Angles for each house (12 houses)

    // Get the rotated zodiac signs starting from the Ascendant's sign
    const rotatedZodiacSigns = zodiacSigns.slice(signIndex).concat(zodiacSigns.slice(0, signIndex));

    rotatedZodiacSigns.forEach((sign, i) => {
      const angleRad = houseAngles[i] + (15 * Math.PI / 180);  // Shift the angle by 15 degrees counterclockwise
      const signImage = zodiacImages[sign];  // Get the corresponding zodiac image

      // Plot each zodiac sign image in the respective house
      g.append('image')
        .attr('x', (-midRadius * Math.cos(angleRad)) - 15)  // Adjust x for centering
        .attr('y', (midRadius * Math.sin(angleRad)) - 15)  // Adjust y for centering
        .attr('width', 30)  // Image width
        .attr('height', 30)  // Image height
        .attr('href', signImage);  // Path to the zodiac symbol image
    });
  }
}
