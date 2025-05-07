import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentPhotoComponent } from './assessment-photo.component';

describe('AssessmentPhotoComponent', () => {
  let component: AssessmentPhotoComponent;
  let fixture: ComponentFixture<AssessmentPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentPhotoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
