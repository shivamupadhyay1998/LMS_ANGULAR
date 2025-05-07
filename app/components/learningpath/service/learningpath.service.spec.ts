import { TestBed } from '@angular/core/testing';

import { LearningpathService } from './learningpath.service';

describe('LearningpathService', () => {
  let service: LearningpathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningpathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
