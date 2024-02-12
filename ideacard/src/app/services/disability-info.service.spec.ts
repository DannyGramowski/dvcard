import { TestBed } from '@angular/core/testing';

import { DisabilityInfoService } from './disability-info.service';

describe('DisabilityInfoService', () => {
  let service: DisabilityInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisabilityInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
