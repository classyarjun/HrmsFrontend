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
  employeeId: number = 1; // Replace with actual logged-in employee ID
  requestType: RequestType = 'REGULARIZATION';
  pendingRequests: RegularizationAndPermission[] = [];
  today: string = ''; // ✅ Store today's date

  form: RequestPayload = {
    requestType: this.requestType,
    reason: '',
    date: '',
    clockIn: '',
    clockOut: '',
    email: ''
  };

  constructor(private service: RegularizationService) {}

  ngOnInit() {
    // ✅ Get today's date in YYYY-MM-DD format
    this.today = new Date().toISOString().split('T')[0];
    this.loadEmployeeRequests();
  }

  // ✅ Called when request type changes
  onRequestTypeChange() {
    if (this.requestType === 'PERMISSION') {
      this.form.date = this.today; // Auto-set to today's date
    } else {
      this.form.date = ''; // Allow choosing date for Regularization
    }
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
    if (!this.form.reason || !this.form.date || !this.form.clockIn || !this.form.clockOut || !this.form.email) {
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
      date: this.requestType === 'PERMISSION' ? this.today : '',
      clockIn: '',
      clockOut: '',
      email: ''
    };
  }
}
