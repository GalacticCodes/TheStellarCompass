import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FsCheckoutComponent } from './fs-checkout.component';

describe('FsCheckoutComponent', () => {
  let component: FsCheckoutComponent;
  let fixture: ComponentFixture<FsCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FsCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FsCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
