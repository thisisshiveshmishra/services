import { TestBed } from '@angular/core/testing';

import { ServiceRequestServiceService } from './service-request-service.service';

describe('ServiceRequestServiceService', () => {
  let service: ServiceRequestServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceRequestServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
