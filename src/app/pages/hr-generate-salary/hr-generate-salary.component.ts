import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalaryService } from '../../../services/salary.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hr-generate-salary',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './hr-generate-salary.component.html',
  styleUrl: './hr-generate-salary.component.css',
})
export class HrGenerateSalaryComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  fileError: string = '';

  constructor(
    private fb: FormBuilder,
    private salaryService: SalaryService,
    private authService: AuthService
  ) {
    // Initialize form with 'uploadedBy' as disabled (readonly)
    this.uploadForm = this.fb.group({
      uploadedBy: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      userEmail: ['', [Validators.required, Validators.email]],
       role: ['HR'],
    });
  }

  ngOnInit(): void {
    // Set logged in user's email into uploadedBy
    const email = this.authService.getLoggedInEmail();
    this.uploadForm.patchValue({ uploadedBy: email });
  }

  // Validate and select only PDF file
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type !== 'application/pdf') {
        this.fileError = 'Only PDF files are allowed.';
        this.selectedFile = null;
        input.value = ''; // clear input
        return;
      }

      this.selectedFile = file;
      this.fileError = '';
      console.log('Selected file:', this.selectedFile);
    }
  }

  // Submit form
  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      this.fileError = this.selectedFile ? '' : 'Please select a PDF file.';
      alert('Please fill all fields and upload a valid PDF file.');
      return;
    }

    const formData = new FormData();
    const formValue = this.uploadForm.getRawValue(); // includes disabled fields

    formData.append('file', this.selectedFile);
    formData.append('uploadedBy', formValue.uploadedBy);
    formData.append('userEmail', formValue.userEmail);
    formData.append('role', formValue.role);

    this.salaryService.uploadSalary(formData).subscribe({
      next: (response) => {
        alert('File uploaded successfully!');
        this.uploadForm.reset();
        this.selectedFile = null;
        this.fileError = '';
        // Reset uploadedBy after reset
        const email = this.authService.getLoggedInEmail();
        this.uploadForm.patchValue({ uploadedBy: email });
      },
      error: (err: any) => {
        console.error('Upload error:', err);
      },
    });
  }
}
