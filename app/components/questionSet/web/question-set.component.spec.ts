import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSetComponent } from './question-set.component';

describe('QuestionSetComponent', () => {
  let component: QuestionSetComponent;
  let fixture: ComponentFixture<QuestionSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
