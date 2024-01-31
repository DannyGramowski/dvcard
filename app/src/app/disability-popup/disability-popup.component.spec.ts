import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityPopupComponent } from './disability-popup.component';

describe('DisabilityPopupComponent', () => {
  let component: DisabilityPopupComponent;
  let fixture: ComponentFixture<DisabilityPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisabilityPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisabilityPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
