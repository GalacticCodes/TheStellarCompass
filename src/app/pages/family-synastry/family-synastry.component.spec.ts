import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilySynastryComponent } from './family-synastry.component';

describe('FamilySynastryComponent', () => {
  let component: FamilySynastryComponent;
  let fixture: ComponentFixture<FamilySynastryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilySynastryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilySynastryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
