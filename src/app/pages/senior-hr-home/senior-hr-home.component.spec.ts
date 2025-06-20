import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorHrHomeComponent } from './senior-hr-home.component';

describe('SeniorHrHomeComponent', () => {
  let component: SeniorHrHomeComponent;
  let fixture: ComponentFixture<SeniorHrHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeniorHrHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeniorHrHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
