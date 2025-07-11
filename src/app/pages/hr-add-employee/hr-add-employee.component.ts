import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AddEmployeeService } from '../../../services/add-employee.service';
import { ToastrService } from 'ngx-toastr';
 
declare var bootstrap: any;
 
@Component({
  selector: 'app-hr-add-employee',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './hr-add-employee.component.html',
  styleUrl: './hr-add-employee.component.css'
})
export class HrAddEmployeeComponent implements OnInit {
  employees: any[] = [];
  employeeForm!: FormGroup;
  editForm!: FormGroup;
  registerForm!: FormGroup;
 
  selectedImage: File | null = null;
  selectedFile: File | null = null;
  selectedEmployeeId!: number;
  showPassword: boolean = false;
  minDate: any;
 
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private addEmployeeService: AddEmployeeService
  ) {}
 
  ngOnInit(): void {
    this.initForms();
    this.getEmployees();
  }
 
  initForms() {
    const nameValidators = [
      Validators.required,
      this.capitalizeValidator,
      Validators.pattern(/^[A-Za-z\s]+$/)
    ];
 
    const emailValidator = [
      Validators.required,
      Validators.pattern(/^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ];
 
    this.employeeForm = this.fb.group({
      firstName: ['', nameValidators],
      lastName: ['', nameValidators],
      email: ['', emailValidator],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      department: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      jobTitle: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      role: ['', Validators.required],
      status: ['', Validators.required],
      joiningDate: ['', [Validators.required, this.futureOrTodayDateValidator]],
      exitDate: ['']
    });
 
    this.editForm = this.fb.group({
      firstName: ['', nameValidators],
      lastName: ['', nameValidators],
      email: ['', emailValidator],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      department: ['', Validators.required],
      jobTitle: ['', Validators.required],
      role: ['', Validators.required],
      status: ['', Validators.required],
      joiningDate: ['', [Validators.required, this.futureOrTodayDateValidator]],
      exitDate: ['']
    });
 
    this.registerForm = this.fb.group({
      firstName: ['', nameValidators],
      lastName: ['', nameValidators],
      email: ['', emailValidator],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required]
    });
  }
 
  allowLettersOnly(event: KeyboardEvent) {
    const regex = /^[A-Za-z\s]$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }
 
  capitalizeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value.length > 0 && value[0] !== value[0].toUpperCase()) {
      return { notCapitalized: true };
    }
    return null;
  }
 
  futureOrTodayDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (control.value && selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }
 
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
 
  getEmployees() {
    this.addEmployeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res;
      },
      error: (err) => {
        console.error('❌ Error fetching employees:', err);
        this.toastr.error('Failed to load employee list');
      }
    });
  }
 
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedImage = file;
    }
  }
 
  onSubmit() {
    if (this.employeeForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
 
    const formData = new FormData();
    formData.append('employeeData', JSON.stringify(this.employeeForm.value));
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile);
    }
 
    this.addEmployeeService.addEmployeeWithImage(formData).subscribe({
      next: () => {
        (document.getElementById('closeModalBtn') as HTMLElement)?.click();
        this.toastr.success('Employee added successfully!');
        this.employeeForm.reset();
        this.selectedFile = null;
        this.getEmployees();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to add employee.');
      }
    });
  }
 
  openEditModal(emp: any) {
    if (!emp) return;
 
    this.selectedEmployeeId = emp.id;
    this.editForm.patchValue(emp);
 
    const modalEl = document.getElementById('editEmployeeModal');
    if (modalEl) {
      new bootstrap.Modal(modalEl).show();
    }
  }
 
  onEditSubmit() {
    if (this.editForm.invalid) {
      this.toastr.error('Please fix the errors in the form.');
      return;
    }
 
    this.addEmployeeService.updateEmployeeWithImage(this.selectedEmployeeId, this.editForm.value).subscribe({
      next: () => {
        (document.getElementById('closeEditModalBtn') as HTMLElement)?.click();
        this.getEmployees();
        this.toastr.success('Employee updated successfully!');
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to update employee.');
      }
    });
  }
 
  openRegisterModal(emp: any) {
    if (!emp) return;
 
    this.selectedEmployeeId = emp.id;
    this.registerForm.patchValue({
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      role: emp.role || '',
      password: ''
    });
 
    const modalEl = document.getElementById('registerModal');
    if (modalEl) {
      new bootstrap.Modal(modalEl).show();
    }
  }
 
  onRegister() {
    if (!this.selectedEmployeeId || this.registerForm.invalid) {
      this.toastr.error('Please complete registration form correctly.');
      return;
    }
 
    const registerFormValue = this.registerForm.value;
    const userData = {
      email: registerFormValue.email,
      password: registerFormValue.password,
      role: registerFormValue.role,
      firstName: registerFormValue.firstName,
      lastName: registerFormValue.lastName,
      employee: { id: this.selectedEmployeeId }
    };
 
    const formData = new FormData();
    formData.append('userData', JSON.stringify(userData));
 
    if (this.selectedImage) {
      formData.append('profilePicture', this.selectedImage);
    }
 
    this.addEmployeeService.registerEmployee(formData).subscribe({
      next: () => {
        (document.getElementById('closeRegisterModalBtn') as HTMLElement)?.click();
        this.selectedImage = null;
        this.toastr.success('Employee registered successfully!');
        this.getEmployees();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to register employee.');
      }
    });
  }
 
  delete(id: number) {
    if (confirm('Are you sure you want to delete?')) {
      this.addEmployeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.toastr.success('Employee deleted successfully!');
          this.getEmployees();
        },
        error: () => {
          this.toastr.error('Failed to delete employee.');
        }
      });
    }
  }
 
  resetForm() {
    this.employeeForm.reset();
    this.selectedFile = null;
  }
}
 