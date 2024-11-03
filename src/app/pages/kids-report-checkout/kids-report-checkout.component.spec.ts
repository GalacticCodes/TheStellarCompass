import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsReportCheckoutComponent } from './kids-report-checkout.component';

describe('KidsReportCheckoutComponent', () => {
  let component: KidsReportCheckoutComponent;
  let fixture: ComponentFixture<KidsReportCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KidsReportCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KidsReportCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
