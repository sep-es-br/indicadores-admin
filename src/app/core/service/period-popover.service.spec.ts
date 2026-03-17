import { TestBed } from '@angular/core/testing';

import { PeriodPopoverService } from './period-popover.service';

describe('PeriodPopoverService', () => {
  let service: PeriodPopoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodPopoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
