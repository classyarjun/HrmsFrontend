import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorHrLayoutComponent } from './senior-hr-layout.component';

describe('SeniorHrLayoutComponent', () => {
  let component: SeniorHrLayoutComponent;
  let fixture: ComponentFixture<SeniorHrLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeniorHrLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeniorHrLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
