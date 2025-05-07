import { TestBed } from '@angular/core/testing';

import { AssessmentlevelService } from './assessmentlevel.service';

describe('AssessmentlevelService', () => {
  let service: AssessmentlevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentlevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
