import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerHolidayComponent } from './manager-holiday.component';

describe('ManagerHolidayComponent', () => {
  let component: ManagerHolidayComponent;
  let fixture: ComponentFixture<ManagerHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerHolidayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagerHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
