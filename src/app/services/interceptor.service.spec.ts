import { TestBed } from '@angular/core/testing';

import { SessionInterceptor } from './interceptor.service';

describe('InterceptorService', () => {
  let service: SessionInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
