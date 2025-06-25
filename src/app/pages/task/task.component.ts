// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TaskService } from '../../../services/task.service';


// @Component({
//   selector: 'app-employee-task',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './task.component.html',
//   styleUrls: ['./task.component.css']
// })
// export class TaskComponent implements OnInit {
//   task: any = null;
//   message = '';

//   constructor(private taskService: TaskService) {}

//   ngOnInit(): void {
//     const taskId = localStorage.getItem('employeeTaskId');

//     if (taskId) {
//       this.taskService.getTaskById(+taskId).subscribe({
//         next: (res: any) => {
//           this.task = res;
//         },
//         error: (err: any) => {
//           this.message = err.error || 'Task not found';
//         }
//       });
//     } else {
//       this.message = 'No task assigned yet.';
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';


@Component({
  selector: 'app-employee-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  task: any = null;
  message = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    const taskId = localStorage.getItem('employeeTaskId');

    if (taskId) {
      this.taskService.getTaskById(+taskId).subscribe({
        next: (res: any) => {
          this.task = res;
        },
        error: (err: any) => {
          this.message = err.error || 'Task not found';
        }
      });
    } else {
      this.message = 'No task assigned yet.';
    }
  }
}
