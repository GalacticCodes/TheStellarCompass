import { TestBed } from '@angular/core/testing';

import { SynastryService } from './synastry.service';

describe('SynastryService', () => {
  let service: SynastryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynastryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
