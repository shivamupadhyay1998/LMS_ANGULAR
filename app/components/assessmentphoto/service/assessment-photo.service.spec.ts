import { TestBed } from '@angular/core/testing';

import { AssessmentPhotoService } from './assessment-photo.service';

describe('AssessmentPhotoService', () => {
  let service: AssessmentPhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentPhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
