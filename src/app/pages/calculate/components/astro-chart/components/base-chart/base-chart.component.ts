import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-base-chart',
  template: `
    <svg id="base-chart" class="chart"></svg>
  `,
  standalone: true
})
export class BaseChartComponent implements OnInit {

  private width = 800;
  private height = 800;
  private radius = Math.min(this.width, this.height) / 2;
  private svg: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.createChart();  // Create the base chart
  }

  createChart(): void {
    const svg = d3.select(this.el.nativeElement).select('#base-chart')
    .attr('preserveAspectRatio', 'xMinYMin meet')  // Maintain aspect ratio
    .attr('viewBox', `0 0 ${this.width} ${this.height}`)  // Responsive SVG
    .classed('svg-content-responsive', true)  // Add class for custom styling
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
  
    const angles = d3.range(0, 2 * Math.PI, Math.PI / 6);  // 12 slices
    const innerRadius = this.radius * 0.75;
    const midRadius = this.radius * 0.55;
    const tinyRadius = this.radius * 0.12;
    const microRadius = this.radius * 0.08;
    const outerRadius = this.radius * 0.9;
    const outsideRadius = this.radius;
  
    // Add a white circle that spans the entire chart (the base layer)
    svg.append('circle')
      .attr('r', this.radius)  // Circle covers the entire radius
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', 'white');  // White color
  
    // Restore shading for the outer circle
    svg.append('path')
      .attr('d', d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI) as any)
      .attr('fill', 'antiquewhite')
      .attr('opacity', .69);
  
    svg.append('path')
      .attr('d', d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(midRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI) as any)
      .attr('fill', 'purple')
      .attr('opacity', 0.05);
  
    svg.append('path')
      .attr('d', d3.arc()
        .innerRadius(outerRadius)
        .outerRadius(outsideRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI) as any)
      .attr('fill', 'purple')
      .attr('opacity', 0.05);
  
    // Draw the thin line at the mid radius
    svg.append('circle')
      .attr('r', midRadius)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)
      .attr('fill', 'none');
  
    // Draw the thin line at the inner radius
    svg.append('circle')
      .attr('r', innerRadius)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)
      .attr('fill', 'none');
  
    // Draw the thin line at the tiny radius
    svg.append('circle')
      .attr('r', tinyRadius)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)
      .attr('fill', 'none');
  
    // Numbers 1 to 12 at every 30 degrees starting from the 9 o'clock position
    const numbers = d3.range(1, 13);  // Array of numbers 1 to 12
    const numberAngles = d3.range(Math.PI - Math.PI / 12, -Math.PI, -Math.PI / 6);  // Counterclockwise shift by -15 degrees
  
    numbers.forEach((number, i) => {
      const angleRad = numberAngles[i];
  
      svg.append('text')
        .attr('x', microRadius * Math.cos(angleRad))
        .attr('y', microRadius * Math.sin(angleRad))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '8px')  // Adjust the font size
        .text(number.toString());  // Display the number
    });
  
    // Draw the 12 slices for the zodiac/pie chart
    angles.forEach((startAngle) => {
      const endAngle = startAngle + Math.PI / 6;
  
      svg.append('path')
        .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(outerRadius)
          .startAngle(startAngle)
          .endAngle(endAngle) as any)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.75)  // Thinner line
        .attr('stroke-opacity', 0.1)  // Adjust opacity to make the lines semi-transparent
        .attr('fill', 'none');
    });
  
    // Plot tick marks at both inside and outside edges of the chart
    this.plotTickMarks(svg, innerRadius, midRadius, outerRadius);
  }
  

  // Function to plot tick marks at every degree and mirrored tick marks on the opposite side
plotTickMarks(svg: any, innerRadius: number, midRadius: number, outerRadius: number): void {
  const degreeAngles = d3.range(0, 360, 1); // Array of 1-degree increments

  degreeAngles.forEach(deg => {
    const angleRad = (deg * Math.PI) / 180;
    const mirroredAngleRad = ((deg + 180) % 360) * (Math.PI / 180);  // Mirrored angle, 180 degrees apart
    const isMediumTick = deg % 10 === 0;

    // Inner tick marks (inside the chart)
    const innerTickRadiusInner = isMediumTick ? innerRadius - 5 : innerRadius -3; // Inner circle tick marks
    const innerTickRadiusOuter = isMediumTick ? innerRadius: innerRadius;

    // Outer tick marks (outside the chart)
    const outerTickRadiusInner = outerRadius;
    const outerTickRadiusOuter = isMediumTick ? outerRadius + 10 : outerRadius + 5;
    const outerTickRadiusInside = isMediumTick ? outerRadius + 10 : outerRadius + 5;

    // Inner-side tick marks on the outer circle (shifted by +5)
    const shiftedOuterTickRadiusInner = isMediumTick ? outerRadius - 5 : outerRadius - 5;
    const shiftedOuterTickRadiusOuter = outerRadius + 5;

    // Draw tick marks for both the original and mirrored angles

    // Draw inner tick marks (inside the .875 radius) - original angle
    svg.append('line')
      .attr('x1', innerTickRadiusInner * Math.cos(angleRad))
      .attr('y1', innerTickRadiusInner * Math.sin(angleRad))
      .attr('x2', innerTickRadiusOuter * Math.cos(angleRad))
      .attr('y2', innerTickRadiusOuter * Math.sin(angleRad))
      .attr('stroke', 'black')
      .attr('stroke-width', isMediumTick ? 1 : 0.5);

    // Draw inner tick marks (inside the .875 radius) - mirrored angle
    svg.append('line')
      .attr('x1', innerTickRadiusInner * Math.cos(mirroredAngleRad))
      .attr('y1', innerTickRadiusInner * Math.sin(mirroredAngleRad))
      .attr('x2', innerTickRadiusOuter * Math.cos(mirroredAngleRad))
      .attr('y2', innerTickRadiusOuter * Math.sin(mirroredAngleRad))
      .attr('stroke', 'black')
      .attr('stroke-width', isMediumTick ? 1 : 0.5);

    // Draw outer tick marks (outside the chart) - original angle
    svg.append('line')
      .attr('x1', outerTickRadiusInner * Math.cos(angleRad))
      .attr('y1', outerTickRadiusInner * Math.sin(angleRad))
      .attr('x2', outerTickRadiusOuter * Math.cos(angleRad))
      .attr('y2', outerTickRadiusOuter * Math.sin(angleRad))
      .attr('stroke', 'black')
      .attr('stroke-width', isMediumTick ? 1 : 0.5);

    // Draw outer tick marks (outside the chart) - mirrored angle
    svg.append('line')
      .attr('x1', outerTickRadiusInner * Math.cos(mirroredAngleRad))
      .attr('y1', outerTickRadiusInner * Math.sin(mirroredAngleRad))
      .attr('x2', outerTickRadiusOuter * Math.cos(mirroredAngleRad))
      .attr('y2', outerTickRadiusOuter * Math.sin(mirroredAngleRad))
      .attr('stroke', 'black')
      .attr('stroke-width', isMediumTick ? 1 : 0.5);

    // Draw outer tick marks pointing slightly inside the chart - original angle
    svg.append('line')
      .attr('x1', outerTickRadiusInner * Math.cos(angleRad))
      .attr('y1', outerTickRadiusInner * Math.sin(angleRad))
      .attr('x2', outerTickRadiusInside * Math.cos(angleRad))
      .attr('y2', outerTickRadiusInside * Math.sin(angleRad))
      .attr('stroke', 'black')
      .attr('stroke-width', isMediumTick ? 1 : 0.5);

    // Draw outer tick marks pointing slightly inside the chart - mirrored angle
    svg.append('line')
      .attr('x1', outerTickRadiusInner * Math.cos(mirroredAngleRad))
      .attr('y1', outerTickRadiusInner * Math.sin(mirroredAngleRad))
      .attr('x2', outerTickRadiusInside * Math.cos(mirroredAngleRad))
      .attr('y2', outerTickRadiusInside * Math.sin(mirroredAngleRad))
      .attr('stroke', 'black')
      .attr('stroke-width', isMediumTick ? 1 : 0.5);
  });
}
} 

