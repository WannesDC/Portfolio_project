import { TestBed } from '@angular/core/testing';

import { PortfolioDataService } from './portfolio-data.service';

describe('PortfolioDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PortfolioDataService = TestBed.get(PortfolioDataService);
    expect(service).toBeTruthy();
  });
});
