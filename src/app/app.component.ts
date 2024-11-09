import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { FaqComponent } from './layout/faq/faq.component';
import { AstroTableComponent } from './layout/astro-table/astro-table.component';
import { ReadingCheckoutComponent } from './pages/reading-checkout/reading-checkout.component';
import { FamilySynastryComponent } from './pages/family-synastry/family-synastry.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { AboutComponent } from './pages/about/about.component';
import { TestimonialsComponent } from './pages/testimonials/testimonials.component';
import { NatalDetailsComponent } from './pages/calculate/components/astro-chart/components/natal-details/natal-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, NavbarComponent, FooterComponent, FaqComponent, AstroTableComponent, ReadingCheckoutComponent, FamilySynastryComponent, PrivacyPolicyComponent, AboutComponent, TestimonialsComponent, NatalDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'The Stellar Compass';
}
