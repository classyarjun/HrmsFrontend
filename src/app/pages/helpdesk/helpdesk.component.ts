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
import { ApplyLeavesService } from '../../../services/apply-leaves.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-helpdesk',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,NgSelectModule],
  templateUrl: './helpdesk.component.html',
  styleUrl: './helpdesk.component.css',
})
export class HelpDeskComponent implements OnInit {
  ticketForm: FormGroup;
  tickets: any[] = [];
  isLoading = false;
  fileUploadProgress: number | null = null;
  priorities = ['LOW', 'MEDIUM', 'HIGH'];
  emailList: any[] = []; // Array to hold email list

  constructor(
    private fb: FormBuilder,
    private helpDeskService: HelpdeskService,
    private toaster: ToastrService,
    private applyLeavesService: ApplyLeavesService // Assuming this service has the method to fetch email list
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
    this.fetchEmailList(); // Load email list on component initialization
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

 fetchEmailList(): void {
    this.applyLeavesService.getCcToEmployees().subscribe({
      next: (data: any[]) => {
        this.emailList = data;
      },
      error: (err) => {
        console.error('Failed to load email list', err);
      }
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

  onSubmit(): void {

  if (this.ticketForm.invalid) {
    this.ticketForm.markAllAsTouched();
    return;
  }

  const formValue = this.ticketForm.value;

  const helpDeskPayload = {
    category: formValue.category,
    subject: formValue.subject,
    description: formValue.description,
    ccTo: Array.isArray(formValue.ccTo)
      ? formValue.ccTo.map((e: any) => e.email).filter(Boolean)
      : [],
    priority: formValue.priority,
  };

  const formData = new FormData();
  formData.append('helpDesk', JSON.stringify(helpDeskPayload));

  if (formValue.file) {
    formData.append('file', formValue.file);
  }

  this.isLoading = true;
  this.fileUploadProgress = 0;

  this.helpDeskService.createTicket(formData).subscribe({
    next: () => {
      this.ticketForm.reset({
        priority: 'MEDIUM',
        ccTo: [],
      });
      this.loadTickets();
      this.fileUploadProgress = null;
      this.toaster.success('Ticket submitted successfully!', 'Success ✅');
    },
    error: (err) => {
      console.error('❌ Error submitting ticket:', err);
      this.isLoading = false;
      this.fileUploadProgress = null;
      this.toaster.error(err?.error || 'Failed to submit ticket.', 'Error ❌');
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
