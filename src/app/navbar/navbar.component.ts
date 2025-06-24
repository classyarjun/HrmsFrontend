import { AddEmployeeService } from './../../services/add-employee.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, HttpClientModule, ReactiveFormsModule,CommonModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

  selectedFile: File | null = null;
  passwordForm: FormGroup;
  userId: number = JSON.parse(localStorage.getItem('userData') || '{}').id || 0;
  profileImageUrl: SafeUrl | null = null;

  @ViewChild('updatePasswordModal') updatePasswordModal!: ElementRef;
  @ViewChild('updateProfileModal') updateProfileModal!: ElementRef;

  ngOnInit(): void {
    this.loadProfilePicture();
  }

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private userService: UserService,
    private addEmployeeService: AddEmployeeService,
    private sanitizer: DomSanitizer
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', Validators.required],
    });
  }





  //! ==>> password update ==========================>>

  openPasswordModal(): void {
    const modal = new bootstrap.Modal(this.updatePasswordModal.nativeElement);
    modal.show();
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const { newPassword } = this.passwordForm.value;

      this.userService.updatePassword(this.userId, newPassword).subscribe({
        next: (res) => {
          this.toastr.success(
            res.message || 'Password updated successfully',
            'Success'
          );
          this.passwordForm.reset();


      // ✅ Modal ko close karo
          const modalElement = this.updatePasswordModal.nativeElement;
          if (modalElement) {
            // Bootstrap modal instance le lo
            const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modal.hide();
          }

        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to update password', 'Error');
        },
      });
    }
  }

  //! ==>> profile picture update ===================>>

  openProfileModal(): void {
    const modal = new bootstrap.Modal(this.updateProfileModal.nativeElement);
    modal.show();
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onProfileSubmit(): void {
    if (!this.selectedFile) {
      this.toastr.warning('Please select a file', 'Warning');
      return;
    }

    this.userService
      .updateProfilePicture(this.userId, this.selectedFile)
      .subscribe({
        next: (res) => {
          this.toastr.success(
            res.message || 'Profile picture updated successfully',
            'Success'
          );
          this.selectedFile = null;
          // ✅ Modal ko close karo
          const modalElement = this.updateProfileModal.nativeElement;
          if (modalElement) {
            // Bootstrap modal instance le lo
            const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modal.hide();
          }
          // Reload the profile picture
          this.loadProfilePicture();

        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to update profile picture', 'Error');
        },
      });
  }



  //! ==>> get profile picture  ================================>>

  loadProfilePicture(): void {
    this.userService.getProfilePicture(this.userId).subscribe({
      next: (blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (err) => {
        console.error('Error loading profile picture', err);
      },
    });
  }

   //! ==>> logout method ===================================>>

  logout() {
    localStorage.clear();
    this.toastr.success('User Log-Out successfully!','Success');
    this.router.navigate(['/login']);
  }
}
