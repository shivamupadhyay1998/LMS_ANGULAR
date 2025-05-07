import { TestBed } from '@angular/core/testing';

import { TopicstatusService } from './topicstatus.service';

describe('TopicstatusService', () => {
  let service: TopicstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
