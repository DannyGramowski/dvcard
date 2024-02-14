import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSubmitSuccessComponent } from './test-submit-success.component';

describe('TestSubmitSuccessComponent', () => {
  let component: TestSubmitSuccessComponent;
  let fixture: ComponentFixture<TestSubmitSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSubmitSuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestSubmitSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
