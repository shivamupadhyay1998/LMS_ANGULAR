import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSetByCourseComponent } from './question-set-by-course.component';

describe('QuestionSetByCourseComponent', () => {
  let component: QuestionSetByCourseComponent;
  let fixture: ComponentFixture<QuestionSetByCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionSetByCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionSetByCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
