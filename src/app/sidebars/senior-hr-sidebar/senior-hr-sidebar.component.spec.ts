import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorHrSidebarComponent } from './senior-hr-sidebar.component';

describe('SeniorHrSidebarComponent', () => {
  let component: SeniorHrSidebarComponent;
  let fixture: ComponentFixture<SeniorHrSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeniorHrSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeniorHrSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
