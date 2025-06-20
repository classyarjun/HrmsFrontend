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

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  selectedFile: File | null = null;
  passwordForm: FormGroup;
  userId: number = JSON.parse(localStorage.getItem('userData') || '{}').id || 0;

  @ViewChild('updatePasswordModal') updatePasswordModal!: ElementRef;
  @ViewChild('updateProfileModal') updateProfileModal!: ElementRef;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private userService: UserService
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
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to update profile picture', 'Error');
        },
      });
  }

  //! ==>> logout method ===================================>>

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
