import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentlevelComponent } from './assessmentlevel.component';

describe('AssessmentlevelComponent', () => {
  let component: AssessmentlevelComponent;
  let fixture: ComponentFixture<AssessmentlevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentlevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentlevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
