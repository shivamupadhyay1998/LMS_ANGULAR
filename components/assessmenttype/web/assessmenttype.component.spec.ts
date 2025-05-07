import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmenttypeComponent } from './assessmenttype.component';

describe('AssessmenttypeComponent', () => {
  let component: AssessmenttypeComponent;
  let fixture: ComponentFixture<AssessmenttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmenttypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmenttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
