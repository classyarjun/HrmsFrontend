import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HelpdeskService } from '../../../services/helpdesk.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-helpdesk',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './helpdesk.component.html',
  styleUrl: './helpdesk.component.css',
})
export class HelpDeskComponent implements OnInit {
  ticketForm: FormGroup;
  tickets: any[] = [];
  isLoading = false;
  fileUploadProgress: number | null = null;
  priorities = ['LOW', 'MEDIUM', 'HIGH'];

  constructor(
    private fb: FormBuilder,
    private helpDeskService: HelpdeskService
  ) {
    this.ticketForm = this.fb.group({
      category: ['', [Validators.required, Validators.maxLength(50)]],
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      ccTo: [''],
      priority: ['MEDIUM', Validators.required],
      file: [null],
    });
  }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.helpDeskService.getAllTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.ticketForm.patchValue({ file });
      this.ticketForm.get('file')?.updateValueAndValidity();
    }
  }

  // onSubmit(): void {
  //   if (this.ticketForm.invalid) {
  //     this.ticketForm.markAllAsTouched();
  //     return;
  //   }

  //   const formValue = this.ticketForm.value;

  //   // 🎯 Convert the form fields (except file) into a single JSON string
  //   const helpDeskPayload = {
  //     category: formValue.category,
  //     subject: formValue.subject,
  //     description: formValue.description,
  //     ccTo: formValue.ccTo.split(',').map((email: string) => email.trim()), // ✅ Fix here
  //     priority: formValue.priority,
  //   };

  //   const formData = new FormData();
  //   formData.append('helpDesk', JSON.stringify(helpDeskPayload));

  //   // Append file if selected
  //   if (formValue.file) {
  //     formData.append('file', formValue.file);
  //   }

  //   this.isLoading = true;
  //   this.fileUploadProgress = 0;

  //   this.helpDeskService.createTicket(formData).subscribe({
  //     next: () => {
  //       this.ticketForm.reset({
  //         priority: 'MEDIUM',
  //       });
  //       this.loadTickets();
  //       this.fileUploadProgress = null;
      
  //     },

  //     error: () => {

  //       this.isLoading = false;
  //       this.fileUploadProgress = null;
  //     },
  //   });
  // }





  onSubmit(): void {
  if (this.ticketForm.invalid) {
    this.ticketForm.markAllAsTouched();
    alert('कृपया सभी ज़रूरी फ़ील्ड भरें।');
    return;
  }

  const formValue = this.ticketForm.value;

  // ✅ Validate file type or size if needed here (optional)

  const helpDeskPayload = {
    category: formValue.category,
    subject: formValue.subject,
    description: formValue.description,
    ccTo: formValue.ccTo
      ? formValue.ccTo.split(',').map((email: string) => email.trim())
      : [],
    priority: formValue.priority,
  };

  const formData = new FormData();
  formData.append('helpDesk', JSON.stringify(helpDeskPayload));

  // ✅ Optional: Check if file is a valid File object
  if (formValue.file instanceof File) {
    formData.append('file', formValue.file);
  }

  this.isLoading = true;
  this.fileUploadProgress = 0;

  this.helpDeskService.createTicket(formData).subscribe({
    next: () => {
      alert('Ticket सफलतापूर्वक सबमिट हो गया है!');
      this.ticketForm.reset({
        priority: 'MEDIUM',
      });
      this.loadTickets();
      this.isLoading = false;
      this.fileUploadProgress = null;
    },

    error: (err) => {
      alert('Ticket सफलतापूर्वक सबमिट हो गया है!');
    this.loadTickets();
      this.isLoading = false;
      this.fileUploadProgress = null;
    },
  });
}


  deleteTicket(id: number): void {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.helpDeskService.deleteTicket(id).subscribe(() => {
        this.loadTickets();
      });
    }
  }

  downloadFile(id: number): void {
    this.helpDeskService.downloadFile(id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${id}-attachment`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'bg-danger';
      case 'MEDIUM':
        return 'bg-warning text-dark';
      case 'LOW':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
}
