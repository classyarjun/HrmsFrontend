
import { Component } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-manager-task',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './manager-task.component.html',
  styleUrl: './manager-task.component.css'
})
export class ManagerTaskComponent {

 taskForm: FormGroup;
  selectedFile: File | null = null;
  message = '';

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: [''],
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
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      dueDate: this.taskForm.value.dueDate
    };

    const employeeId = this.taskForm.value.employeeId;

    this.taskService.createTask(task, this.selectedFile!, employeeId).subscribe({
      next: (res: any) => {
        this.message = res;
      },
      error: (err:any) => {
        this.message = err.error;
      }
    });
  }
}

