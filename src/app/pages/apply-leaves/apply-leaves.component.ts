// import { Component } from '@angular/core';
// import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { ApplyLeavesService } from '../../../services/apply-leaves.service';

// @Component({
//   selector: 'app-apply-leaves',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
//   templateUrl: './apply-leaves.component.html',
//   styleUrls: ['./apply-leaves.component.css']
// })
// export class ApplyLeavesComponent {
//   leaveForm: FormGroup;
//   selectedFile: File | null = null;
//   leaveTypes = ['SICK', 'CASUAL', 'PAID', 'UNPAID', 'MATERNITY'];

//  employeeId = JSON.parse(localStorage.getItem('userData') || '{}').EmployeeId || '';


//   constructor(private fb: FormBuilder, private applyLeavesService: ApplyLeavesService) {
//     this.leaveForm = this.fb.group({
//       fromDate: ['', Validators.required],
//       toDate: ['', Validators.required],
//       reason: ['', Validators.required],
//       applyingTo: ['', [Validators.required, Validators.email]],
//       ccTo: [''],
//       contactDetails: ['', Validators.required],
//       leaveType: ['', Validators.required]
//     });
//   }

//   onFileChange(event: any): void {
//     this.selectedFile = event.target.files[0];
//   }

//   submitForm(): void {
//   if (this.leaveForm.invalid) return;

//   const formVal = this.leaveForm.value;

//   const userCCs = formVal.ccTo
//     ? formVal.ccTo.split(',').map((s: string) => s.trim()).filter(Boolean)
//     : [];

//   const manualCCs = ['hr@gmail.com', 'manager@gmail.com'];
//   const finalCC = Array.from(new Set([...userCCs, ...manualCCs]));

//   // ✅ Use employeeId from localStorage here
//   const jsonPart = JSON.stringify({
//     employeeId: this.employeeId,
//     fromDate: formVal.fromDate,
//     toDate: formVal.toDate,
//     reason: formVal.reason,
//     applyingTo: formVal.applyingTo,
//     ccTo: finalCC.join(','), // comma-separated string
//     contactDetails: formVal.contactDetails,
//     leaveType: formVal.leaveType
//   });

//   const formData = new FormData();
//   formData.append('request', new Blob([jsonPart], { type: 'application/json' }));

//   if (this.selectedFile) {
//     formData.append('file', this.selectedFile);
//   }

//   this.applyLeavesService.applyLeave(formData).subscribe({
//     next: () => {
//       alert('Leave applied successfully.');
//       this.leaveForm.reset();
//       this.selectedFile = null;
//     },
//     error: (err) => {
//       console.error('Error applying leave:', err);
//       alert('Error applying leave: ' + (err.message || 'Unknown error'));
//     }
//   });
//   }

// }


import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApplyLeavesService } from '../../../services/apply-leaves.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-apply-leaves',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, ToastrModule],
  templateUrl: './apply-leaves.component.html',
  styleUrls: ['./apply-leaves.component.css']
})
export class ApplyLeavesComponent {
  leaveForm: FormGroup;
  selectedFile: File | null = null;
  leaveTypes = ['SICK', 'CASUAL', 'PAID', 'UNPAID', 'MATERNITY'];

  employeeId = JSON.parse(localStorage.getItem('userData') || '{}').EmployeeId || '';

  constructor(
    private fb: FormBuilder,
    private applyLeavesService: ApplyLeavesService,
    private toastr: ToastrService // 👈 Inject Toastr
  ) {
    this.leaveForm = this.fb.group({
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
    if (this.leaveForm.invalid) {
      this.toastr.error('Please fill all required fields.', 'Invalid Form');
      return;
    }

    const formVal = this.leaveForm.value;

    const userCCs = formVal.ccTo
      ? formVal.ccTo.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const manualCCs = ['hr@gmail.com', 'manager@gmail.com'];
    const finalCC = Array.from(new Set([...userCCs, ...manualCCs]));

    const jsonPart = JSON.stringify({
      employeeId: this.employeeId,
      fromDate: formVal.fromDate,
      toDate: formVal.toDate,
      reason: formVal.reason,
      applyingTo: formVal.applyingTo,
      ccTo: finalCC.join(','),
      contactDetails: formVal.contactDetails,
      leaveType: formVal.leaveType
    });

    const formData = new FormData();
    formData.append('request', new Blob([jsonPart], { type: 'application/json' }));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.applyLeavesService.applyLeave(formData).subscribe({
      next: () => {
        this.toastr.success('Leave applied successfully.', 'Success ✅');
        this.leaveForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Error applying leave:', err);
        this.toastr.error(err?.error || 'Failed to apply leave.', 'Error ❌');
      }
    });
  }
}
