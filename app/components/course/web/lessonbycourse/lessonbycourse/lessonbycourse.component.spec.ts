import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonbycourseComponent } from './lessonbycourse.component';

describe('LessonbycourseComponent', () => {
  let component: LessonbycourseComponent;
  let fixture: ComponentFixture<LessonbycourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonbycourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LessonbycourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
