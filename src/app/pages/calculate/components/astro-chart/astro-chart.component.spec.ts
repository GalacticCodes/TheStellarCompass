import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstroChartComponent } from './astro-chart.component';

describe('AstroChartComponent', () => {
  let component: AstroChartComponent;
  let fixture: ComponentFixture<AstroChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AstroChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AstroChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
