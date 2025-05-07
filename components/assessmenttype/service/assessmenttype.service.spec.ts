import { TestBed } from '@angular/core/testing';

import { AssessmenttypeService } from './assessmenttype.service';

describe('AssessmenttypeService', () => {
  let service: AssessmenttypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmenttypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
