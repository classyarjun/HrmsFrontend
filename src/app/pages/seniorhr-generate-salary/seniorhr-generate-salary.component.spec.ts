import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorhrGenerateSalaryComponent } from './seniorhr-generate-salary.component';

describe('SeniorhrGenerateSalaryComponent', () => {
  let component: SeniorhrGenerateSalaryComponent;
  let fixture: ComponentFixture<SeniorhrGenerateSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeniorhrGenerateSalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeniorhrGenerateSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
