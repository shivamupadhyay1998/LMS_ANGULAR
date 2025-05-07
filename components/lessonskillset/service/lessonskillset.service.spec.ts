import { TestBed } from '@angular/core/testing';

import { lessionskillsetservice } from './lessonskillset.service';

describe('lessionskillsetservice', () => {
  let service: lessionskillsetservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(lessionskillsetservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
