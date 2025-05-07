import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicstatusComponent } from './topicstatus.component';

describe('TopicstatusComponent', () => {
  let component: TopicstatusComponent;
  let fixture: ComponentFixture<TopicstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicstatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopicstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
