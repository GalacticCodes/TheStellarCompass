import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kids-report-checkout',
  templateUrl: './kids-report-checkout.component.html',
  styleUrls: ['./kids-report-checkout.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule]
})
export class KidsReportCheckoutComponent implements OnInit {
  childName!: string;
  birthDate!: string;
  birthTime!: string;
  birthLocation!: string;
  parentEmail!: string;

  stripePromise = loadStripe('pk_live_51Piz50IGUGN1vRfN1vZJ8r3kVImlPIQ01ea27jmy06TcExR83ImXv5XV3xxdqKcW47y7Sx0mWSbhJjo26ttZ8pWZ00egn50YI2'); 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  async orderKidsReport(): Promise<void> {
    if (!this.childName || !this.birthDate || !this.birthTime || !this.birthLocation || !this.parentEmail) {
      alert('Please fill in all the details.');
      return;
    }

    const orderData = {
      childName: this.childName,
      birthDate: this.birthDate,
      birthTime: this.birthTime,
      birthLocation: this.birthLocation,
      parentEmail: this.parentEmail
    };

    try {
      const stripe = await this.stripePromise;
      
      this.http.post('https://api.thestellarcompass.com/order-kids-report', orderData)
        .subscribe(async (session: any) => {
          if (stripe) {
            const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
            if (error) {
              console.error('Stripe error:', error);
              alert('There was an issue redirecting to the Stripe checkout.');
            }
          }
        }, error => {
          console.error('Error ordering the kids report:', error);
          alert('There was an error ordering the kids report.');
        });
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
  }
}
