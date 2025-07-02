import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HolidayService } from './../../../services/holidays.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.css',
})
export class HolidaysComponent implements OnInit {
  holidayForm: FormGroup;
  holidays: any[] = [];

  successMessage = '';
  errorMessage = '';
  oisDeleting: boolean = false;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private holidayService: HolidayService
  ) {
    this.holidayForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.loadHolidays();
  }

  loadHolidays(): void {
    this.holidayService.getHolidays().subscribe({
      next: (data) => {
        this.holidays = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load holidays.';
      },
    });
  }

  openModal(): void {
    const modal = new bootstrap.Modal(document.getElementById('holidayModal'));
    modal.show();
  }

  closeModal(): void {
    const modalEl = document.getElementById('holidayModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

  onSubmit(): void {
    if (this.holidayForm.valid) {
      const holidayData = this.holidayForm.value;
      this.holidayService.createHoliday(holidayData).subscribe({
        next: () => {
          this.toastr.success('Holiday added successfully!', 'Success');
          this.resetForm();
          this.loadHolidays();
          this.closeModal();
        },
        error: () => {
          this.errorMessage = 'Failed to create holiday.';
        },
      });
    } else {
      this.errorMessage = 'Please fill all required fields.';
    }
  }
  resetForm() {
    throw new Error('Method not implemented.');
  }

  onDelete(id: number): void {
  if (confirm('Are you sure you want to delete this holiday?')) {
    this.oisDeleting = true;

    this.holidayService.deleteHoliday(id).subscribe({
      next: () => {
        // ✅ Remove the holiday from local array immediately
        this.holidays = this.holidays.filter(holiday => holiday.id !== id);

        // ✅ Show success message
        this.toastr.success('Holiday deleted successfully!', 'Success');

        this.oisDeleting = false;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Delete error:', error);
        this.toastr.error('Failed to delete holiday.', 'Error');
        this.oisDeleting = false;
      }
    });
  }
}

}
