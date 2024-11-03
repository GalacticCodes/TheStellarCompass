import { TestBed } from '@angular/core/testing';

import { AstrologyService } from './astrology.service';

describe('AstrologyService', () => {
  let service: AstrologyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AstrologyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
