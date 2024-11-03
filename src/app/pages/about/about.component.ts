import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-me',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public astrologerName: string = 'The Goddess Astrologer';
  public titleMessage: string = 'Meet the Goddess Astrologer';

  constructor() {}

  ngOnInit(): void {
    // Any initialization logic can be placed here
  }

  // Optional method for any interactive features in the future
  scrollToServices() {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
