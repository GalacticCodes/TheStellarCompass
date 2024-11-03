import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/home/home.routes').then(m => m.HomeRoutes)
      },
      {
        path: 'calculate',
        loadChildren: () => import('./pages/calculate/calculate.routes').then(m => m.CalculateRoutes)
      },
      {
        path: 'readings',
        loadChildren: () => import('./pages/readings/readings.routes').then(m => m.ReadingsRoutes)
      },
      {
        path: 'reports',
        loadChildren: () => import('./pages/reports/reports.routes').then(m => m.ReportsRoutes)
      },
      {
        path: 'reading-checkout',
        loadChildren: () => import('./pages/reading-checkout/reading-checkout.routes').then(m => m.ReadingCheckoutRoutes)
      },
      {
        path: 'kids-report',
        loadChildren: () => import('./pages/kids-report/kids-report.routes').then(m => m.KidsReportRoutes)
      },
      {
        path: 'kids-report-checkout',
        loadChildren: () => import('./pages/kids-report-checkout/kids-report-checkout.routes').then(m => m.KidsReportCheckoutRoutes)
      },
      {
        path: 'family-synastry',
        loadChildren: () => import('./pages/family-synastry/family-synastry.routes').then(m => m.FamilySynastryRoutes)
      },
      {
        path: 'privacy-policy',
        loadChildren: () => import('./pages/privacy-policy/privacy-policy.routes').then(m => m.PrivacyPolicyRoutes)
      },
      {
        path: 'fs-checkout',
        loadChildren: () => import('./pages/fs-checkout/fs-checkout.routes').then(m => m.FsCheckoutRoutes)
      },
      {
        path: 'success',
        loadChildren: () => import('./pages/success/success.routes').then(m => m.SuccessRoutes)
      },
      {
        path: 'about',
        loadChildren: () => import('./pages/about/about.routes').then(m => m.AboutRoutes)
      },
      {
        path: 'service-terms',
        loadChildren: () => import('./pages/service-terms/service-terms.routes').then(m => m.ServiceTermsRoutes)
      },
      {
        path: 'testimonials',
        loadChildren: () => import('./pages/testimonials/testimonials.routes').then(m => m.TestimonialsRoutes)
      }
     
    ]
