import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatalDetailsComponent } from './natal-details.component';

describe('NatalDetailsComponent', () => {
  let component: NatalDetailsComponent;
  let fixture: ComponentFixture<NatalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NatalDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NatalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
