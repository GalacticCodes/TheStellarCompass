import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsReportComponent } from './kids-report.component';

describe('KidsReportComponent', () => {
  let component: KidsReportComponent;
  let fixture: ComponentFixture<KidsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KidsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KidsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
