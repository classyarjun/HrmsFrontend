// task.component.ts

import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddEmployeeService } from './../../../services/add-employee.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manager-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './manager-task.component.html',
  styleUrl: './manager-task.component.css',
})
export class ManagerTaskComponent implements OnInit {
  assignee = JSON.parse(localStorage.getItem('userData') || '{}').email || '';
  taskForm: FormGroup;
  selectedFile: File | null = null;
  message = '';
  tasks: any[] = [];
  editingTask: any = null;
  employees: any[] = [];
  today: string = new Date().toISOString().split('T')[0]; // 🟢 Today's date in yyyy-MM-dd format

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private addEmployeeService: AddEmployeeService,
    private toastr: ToastrService
  ) {
   this.taskForm = this.fb.group({
  taskName: [''],
  description: [''],
  priority: [''],
  status: ['PENDING'],
  dueDate: [''],
  taskAssignDate: [''], // 🟢 Add this line
  employeeId: [''],
});

  }

  ngOnInit(): void {
    this.loadTasks();
    this.loadEmployees();
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

 onSubmit() {
  const task = {
    assignee: this.assignee,
    taskName: this.taskForm.value.taskName,
    description: this.taskForm.value.description,
    priority: this.taskForm.value.priority,
     status: this.taskForm.value.status,   // ✅ This picks 'PENDING' or whatever selected
    dueDate: this.taskForm.value.dueDate,
    taskAssignDate: this.taskForm.value.taskAssignDate, // ✅ Include assign date
  };

  const employeeId = this.taskForm.value.employeeId;

  this.taskService.createTask(task, this.selectedFile!, employeeId).subscribe({
    next: (res: any) => {
      this.toastr.success('Task created successfully', 'Success');
      this.taskForm.reset();
      this.loadTasks();
    },
    error: (err: any) => {
      console.error('Error creating task:', err);
      this.toastr.error('Error creating task', 'Error');
      alert('Failed to create task: ' + (err.error?.message || 'Server error'));
    },
  });
}


  loadEmployees() {
    this.addEmployeeService.getEmployees().subscribe({
      next: (res: any) => {
        this.employees = res.map((emp: any) => ({
          id: emp.id,
          fullName: `${emp.firstName} ${emp.lastName}`,
        }));
      },
      error: (err: any) => {
        console.error('Error fetching employees:', err);
      },
    });
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe((data: any) => {
      this.tasks = data;
    });
  }

  onEdit(task: any) {
    this.editingTask = { ...task };
  }

  updateTask() {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe(() => {
        this.editingTask = null;
        this.loadTasks();
      });
    }
  }

  cancelEdit() {
    this.editingTask = null;
  }

  onDelete(id: number) {
    if (confirm('Are you sure to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }
}
