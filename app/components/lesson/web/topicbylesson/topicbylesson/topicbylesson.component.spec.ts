import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicbylessonComponent } from './topicbylesson.component';

describe('TopicbylessonComponent', () => {
  let component: TopicbylessonComponent;
  let fixture: ComponentFixture<TopicbylessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicbylessonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopicbylessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
