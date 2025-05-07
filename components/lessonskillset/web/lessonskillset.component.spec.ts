import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonskillsetComponent } from './lessonskillset.component';

describe('LessonskillsetComponent', () => {
  let component: LessonskillsetComponent;
  let fixture: ComponentFixture<LessonskillsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonskillsetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LessonskillsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
