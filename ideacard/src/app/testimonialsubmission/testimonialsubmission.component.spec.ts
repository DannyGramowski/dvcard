import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsubmissionComponent } from './testimonialsubmission.component';

describe('TestimonialsubmissionComponent', () => {
  let component: TestimonialsubmissionComponent;
  let fixture: ComponentFixture<TestimonialsubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsubmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestimonialsubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
