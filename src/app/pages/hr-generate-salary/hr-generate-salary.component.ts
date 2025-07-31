import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalaryService } from '../../../services/salary.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hr-generate-salary',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './hr-generate-salary.component.html',
  styleUrl: './hr-generate-salary.component.css',
})
export class HrGenerateSalaryComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  fileError: string = '';

  constructor(
    private fb: FormBuilder,
    private salaryService: SalaryService
  ) {
    // Initialize form
    this.uploadForm = this.fb.group({
      uploadedBy: ['', [Validators.required, Validators.email]],
      userEmail: ['', [Validators.required, Validators.email]],
      role: ['HR'],
    });
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
    formData.append('file', this.selectedFile);
    formData.append('uploadedBy', this.uploadForm.get('uploadedBy')?.value);
    formData.append('userEmail', this.uploadForm.get('userEmail')?.value);
    formData.append('role', this.uploadForm.get('role')?.value);

    this.salaryService.uploadSalary(formData).subscribe({
      next: (response) => {
        alert('File uploaded successfully!');
        this.uploadForm.reset();
        this.selectedFile = null;
        this.fileError = '';
      },
      error: (err: any) => {
        console.error('Upload error:', err);
      },
    });
  }
}
