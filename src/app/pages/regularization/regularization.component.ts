import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  RegularizationService,
  RequestPayload,
  RequestType,
  RegularizationAndPermission
} from '../../../services/regularization.service';
 
@Component({
  selector: 'app-regularization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './regularization.component.html',
})
export class RegularizationComponent implements OnInit {
  employeeId: number = 1; // Replace this with actual logged-in employee ID
  requestType: RequestType = 'REGULARIZATION';
  pendingRequests: RegularizationAndPermission[] = [];
 
  form: RequestPayload = {
    requestType: this.requestType,
    reason: '',
    date: '',
    clockIn: '',
    clockOut: '',
  };
 
  constructor(private service: RegularizationService) {}
 
  ngOnInit() {
    this.loadEmployeeRequests();
  }
 
  loadEmployeeRequests(): void {
    if (this.requestType === 'REGULARIZATION') {
      this.service.getRegularizationsByEmployeeId(this.employeeId).subscribe({
        next: (res) => {
          this.pendingRequests = res;
        },
        error: (err) => {
          console.error('Error fetching regularizations:', err);
        }
      });
    } else {
      this.service.getPermissionsByEmployeeId(this.employeeId).subscribe({
        next: (res) => {
          this.pendingRequests = res;
        },
        error: (err) => {
          console.error('Error fetching permissions:', err);
        }
      });
    }
  }
 
  submit() {
    if (!this.form.reason || !this.form.date || !this.form.clockIn || !this.form.clockOut) {
      alert('All fields are required.');
      return;
    }
 
    this.form.requestType = this.requestType;
 
    const request$ =
      this.requestType === 'REGULARIZATION'
        ? this.service.requestRegularization(this.employeeId, this.form)
        : this.service.requestPermission(this.employeeId, this.form);
 
    request$.subscribe({
      next: (res) => {
        alert(`${this.requestType} request submitted. Status: ${res.status}`);
        this.resetForm();
        this.loadEmployeeRequests();
      },
      error: (err) => {
        alert('Submission failed: ' + (err?.error?.message || err.message));
      }
    });
  }
 
  resetForm() {
    this.form = {
      requestType: this.requestType,
      reason: '',
      date: '',
      clockIn: '',
      clockOut: '',
    };
  }
}
 
 