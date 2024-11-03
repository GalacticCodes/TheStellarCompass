import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reading-checkout',
  templateUrl: './reading-checkout.component.html',
  styleUrls: ['./reading-checkout.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule]
})
export class ReadingCheckoutComponent implements OnInit {
  name!: string;           // Capture user's name
  bookingDate!: string;    // Capture selected booking date
  birthDate!: string;      // Capture user's birth date
  birthTime!: string;      // Capture user's birth time
  birthLocation!: string;  // Capture user's birth location
  email!: string;          // Capture user's email
  availableDates: string[] = [];

  stripePromise = loadStripe('pk_live_51Piz50IGUGN1vRfN1vZJ8r3kVImlPIQ01ea27jmy06TcExR83ImXv5XV3xxdqKcW47y7Sx0mWSbhJjo26ttZ8pWZ00egn50YI2'); 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAvailableDates();
  }

  getAvailableDates(): void {
    this.http.get<string[]>('https://api.thestellarcompass.com/available-dates')
      .subscribe((dates) => {
        this.availableDates = dates;
      }, error => {
        console.error('Error fetching available dates:', error);
      });
  }

  async bookReading(): Promise<void> {
    if (!this.name || !this.bookingDate || !this.birthDate || !this.birthTime || !this.birthLocation || !this.email) {
      alert('Please fill in all the details.');
      return;
    }

    const bookingData = {
      name: this.name,  // Include the name in the booking data
      bookingDate: this.bookingDate,
      birthDate: this.birthDate,
      birthTime: this.birthTime,
      birthLocation: this.birthLocation,
      email: this.email
    };

    try {
      const stripe = await this.stripePromise;
      
      this.http.post('https://api.thestellarcompass.com/book-appointment', bookingData)
        .subscribe(async (session: any) => {
          if (stripe) {
            const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
            if (error) {
              console.error('Stripe error:', error);
              alert('There was an issue redirecting to the Stripe checkout.');
            }
          }
        }, error => {
          console.error('Error booking the appointment:', error);
          alert('There was an error booking the appointment.');
        });
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
  }
}
