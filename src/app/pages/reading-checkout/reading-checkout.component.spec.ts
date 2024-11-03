import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingCheckoutComponent } from './reading-checkout.component';

describe('ReadingCheckoutComponent', () => {
  let component: ReadingCheckoutComponent;
  let fixture: ComponentFixture<ReadingCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadingCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
