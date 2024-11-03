import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-galaxy-canvas',
  template: '<canvas id="galaxyCanvas"></canvas>',
  styleUrls: ['./galaxy-canvas.component.css'], 
  standalone: true
})
export class GalaxyCanvasComponent implements OnInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private stars: any[] = [];
  private numStars = 200; // Adjust the number of stars
  private speed = 0.09; // Adjust the speed of the stars

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.setupCanvas();
    this.createStars();
    this.animateStars();
  }

  setupCanvas(): void {
    this.canvas = this.el.nativeElement.querySelector('#galaxyCanvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.updateCanvasSize();
  }

  createStars(): void {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const radius = Math.random() * 1.5;
      const dx = (Math.random() - 0.5) * this.speed;
      const dy = (Math.random() - 0.5) * this.speed;
      const opacity = Math.random();
      this.stars.push({ x, y, radius, dx, dy, opacity });
    }
  }

  animateStars(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      this.ctx.fill();
      star.x += star.dx;
      star.y += star.dy;
      if (star.x < 0 || star.x > this.canvas.width || star.y < 0 || star.y > this.canvas.height) {
        star.x = Math.random() * this.canvas.width;
        star.y = Math.random() * this.canvas.height;
      }
    }
    requestAnimationFrame(() => this.animateStars());
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateCanvasSize();
    this.createStars();
  }

  updateCanvasSize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}
