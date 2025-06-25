
import { Component } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-manager-task',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './manager-task.component.html',
  styleUrl: './manager-task.component.css'
})
export class ManagerTaskComponent {

  assignee = JSON.parse(localStorage.getItem('userData') || '{}').email || '';
  taskForm: FormGroup;
  selectedFile: File | null = null;
  message = '';

  constructor(private fb: FormBuilder,
      private toster :ToastrService,
     private taskService: TaskService
    ) {
    this.taskForm = this.fb.group({
      assignee:[''],
      taskName: [''],
      description: [''],
      dueDate: [''],
      employeeId: ['']
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    const task = {
      assignee: this.assignee,
      taskName: this.taskForm.value.taskName,
      description: this.taskForm.value.description,
      dueDate: this.taskForm.value.dueDate
    };

    const employeeId = this.taskForm.value.employeeId;

    this.taskService.createTask(task, this.selectedFile!, employeeId).subscribe({
      next: (res: any) => {
        this.message = res;
        this.toster.success('Task created successfully');
        this.taskForm.reset();
      },
      error: (err:any) => {
        this.message = err.error;
        this.toster.error('Failed to create task');
        console.error('Error creating task:', err);
      }
    });
  }
}

