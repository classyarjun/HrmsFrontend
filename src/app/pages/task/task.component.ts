import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  employeeId: number;
  assignee: string;
  taskName: string;
}

@Component({
  selector: 'app-user-task',
  standalone: true,
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  employeeId: number = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    this.employeeId = user.id;
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasksByEmployeeId(this.employeeId).subscribe({
      next: (res: Task[]) => this.tasks = res,
      error: (err) => console.error('Error loading tasks:', err),
    });
  }

  globalStatus: TaskStatus = 'PENDING';

updateStatus(taskId: number, newStatus: TaskStatus): void {
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
