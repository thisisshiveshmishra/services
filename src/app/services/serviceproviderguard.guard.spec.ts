import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { serviceproviderguardGuard } from './serviceproviderguard.guard';

describe('serviceproviderguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => serviceproviderguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
