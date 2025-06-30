import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-user-task',
  standalone: true,
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class TaskComponent implements OnInit {
  tasks: any[] = [];
  employeeId: number = 0;
  globalStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' = 'PENDING';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    this.employeeId = user.id;
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasksByEmployeeId(this.employeeId).subscribe({
      next: (res: any[]) => this.tasks = res,
      error: (err) => console.error('Error loading tasks:', err),
    });
  }

  updateStatus(taskId: number, newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'): void {
    this.taskService.updateTaskStatus(taskId, newStatus).subscribe({
      next: (res) => {
        console.log('✅ Task status updated:', res);
      },
      error: (err) => {
        console.error('❌ Failed to update task status:', err);
      }
    });
  }
}
