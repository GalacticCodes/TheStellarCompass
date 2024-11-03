import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';
import { SynastryService } from '../../services/synastry.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fs-checkout',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './fs-checkout.component.html',
  styleUrls: ['./fs-checkout.component.css'],
  providers: [SynastryService]
})
export class FsCheckoutComponent implements OnInit {
  isLoading = false; // Loading flag

  // Form data properties
  name1: string = '';
  birthDate1: string = '';
  birthTime1: string = '';
  birthLocation1: string = '';

  name2: string = '';
  birthDate2: string = '';
  birthTime2: string = '';
  birthLocation2: string = '';

  email: string = '';
  bookingDate: string = '';

  // Available dates for the booking dropdown
  availableDates: string[] = []; // Initialize empty; to be populated from service

  constructor(private http: HttpClient, private synastryService: SynastryService) {}

  // Fetch available dates on component initialization
  ngOnInit() {
    this.synastryService.getAvailableDates().subscribe(
      (data) => {
        this.availableDates = data.availableDates; // Populate available dates
        console.log('Available dates:', this.availableDates); // Print the dates to the console
      },
      (error) => {
        console.error('Error fetching available dates:', error);
      }
    );
  }

  async bookSynastryReading() {
    this.isLoading = true; // Show loading overlay

    const bookingData = {
      person1: {
        name: this.name1,
        birthDate: this.birthDate1,
        birthTime: this.birthTime1,
        birthLocation: this.birthLocation1
      },
      person2: {
        name: this.name2,
        birthDate: this.birthDate2,
        birthTime: this.birthTime2,
        birthLocation: this.birthLocation2
      },
      email: this.email,
      bookingDate: this.bookingDate,
      price: 270
    };

    this.http.post<{ sessionId: string }>('http://localhost:5000/api/book-synastry', bookingData).subscribe(
      async (response) => {
        const stripe = await loadStripe('pk_test_51Piz50IGUGN1vRfNyizbIysC65rWoHTjr96v6LlowUYfxNeqFMb1GbqYFpLZgZAN6qPeUWJF16krIG4TxH3NfawR00hVScBwUN');
        if (stripe && response.sessionId) {
          this.isLoading = false; // Hide loading overlay before redirect
          stripe.redirectToCheckout({ sessionId: response.sessionId });
        }
      },
      error => {
        console.error('Error booking synastry reading:', error);
        this.isLoading = false; // Hide loading overlay on error
        alert('An error occurred while submitting your booking. Please try again.');
      }
    );
  }
}
