import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApplyLeavesService } from '../../../services/apply-leaves.service';

 
// Type definitions inline
type LeaveType = 'SICK' | 'CASUAL' | 'PAID' | 'UNPAID';
type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
 
interface LeaveRequest {
  leaveId?: number;
  employeeId: number;
  fromDate: string;
  toDate: string;
  reason: string;
  applyingTo: string;
  ccTo: string[];
  contactDetails: string;
  leaveType: LeaveType;
  status?: LeaveStatus;
}
 
@Component({
  selector: 'app-apply-leaves',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './apply-leaves.component.html',
  styleUrls: ['./apply-leaves.component.css']
})
export class ApplyLeavesComponent {
  leaveForm: FormGroup;
  selectedFile: File | null = null;
  leaveTypes: LeaveType[] = ['SICK', 'CASUAL', 'PAID', 'UNPAID'];
 
  constructor(private fb: FormBuilder, private applyLeavesService: ApplyLeavesService) {
  
    this.leaveForm = this.fb.group({
      employeeId: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      reason: ['', Validators.required],
      applyingTo: ['', [Validators.required, Validators.email]],
      ccTo: [''],
      contactDetails: ['', Validators.required],
      leaveType: ['', Validators.required]
    });
  }
 
  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }
 
  submitForm(): void {
    if (this.leaveForm.invalid) return;
 
    const formVal = this.leaveForm.value;
    const leaveRequest: LeaveRequest = {
      ...formVal,
      ccTo: formVal.ccTo ? formVal.ccTo.split(',').map((s: string) => s.trim()) : []
    };
 
    this.applyLeavesService.applyLeave(leaveRequest, this.selectedFile || undefined).subscribe({
      next: () => {
        alert('Leave applied successfully.');
        this.leaveForm.reset();
        this.selectedFile = null;
      },
      error: (err: { message: string; }) => {
        console.error('Error applying leave:', err);
        alert('Error applying leave: ' + err.message);
      }
    });
  }
}
 
 