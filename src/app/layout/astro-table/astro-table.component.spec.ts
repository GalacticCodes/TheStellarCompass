import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstroTableComponent } from './astro-table.component';

describe('AstroTableComponent', () => {
  let component: AstroTableComponent;
  let fixture: ComponentFixture<AstroTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AstroTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AstroTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
