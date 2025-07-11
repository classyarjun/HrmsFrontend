// import { Component, inject, OnInit } from '@angular/core';
// import { NgForm, FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { ToastrService } from 'ngx-toastr';
// import {
//   PerformanceReviewService,
//   PerformanceReview,
//   Task
// } from '../../../services/performance-review.service';

// @Component({
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule],
//   selector: 'app-manager-review',
//   templateUrl: './manager-review.component.html',
//   styleUrls: ['./manager-review.component.css']
// })
// export class ManagerReviewComponent implements OnInit {
//   service = inject(PerformanceReviewService);
//   toastr = inject(ToastrService);

//   tasks: Task[] = [];
//   reviews: PerformanceReview[] = [];
//   isEdit = false;
//   originalReview: PerformanceReview | null = null;

//   minDate: string = new Date().toISOString().split('T')[0];

//   review: PerformanceReview = {
//     taskName: '',
//     managerReview: '',
//     reviewDate: '',
//     employee: { id: 0 },
//     task: { id: 0 },
//     description: ''
//   };

//   ngOnInit(): void {
//     this.loadReviews();
//   }

//   loadReviews() {
//   this.service.getAllReviews().subscribe((res: any[]) => {
//     this.reviews = res.map(r => ({
//       ...r,
//       employee: { id: r.employeeId ?? 0 },
//       task: { id: r.taskId ?? 0 }
//     }));
//     console.log('✅ Reviews loaded:', this.reviews);
//   });
// }


//   onEmployeeIdEntered(empId: number) {
//     if (empId) {
//       this.review.employee.id = empId;
//       this.service.getTasksByEmployeeId(empId).subscribe((res: Task[]) => {
//         this.tasks = res;
//         this.review.task = { id: 0 };
//         this.review.taskName = '';
//       });
//     }
//   }

//   onTaskChange(taskId: number) {
//     const selectedTask = this.tasks.find(t => t.id === +taskId);
//     if (selectedTask) {
//       this.review.task.id = selectedTask.id;
//       this.review.taskName = selectedTask.taskName;
//     }
//   }

//   submitReview(form: NgForm) {
//     if (form.invalid) {
//       Object.values(form.controls).forEach(control => control.markAsTouched());
//       this.toastr.error('Please fill in all required fields');
//       return;
//     }

//     const payload = {
//       reviewId: this.review.reviewId,
//       taskName: this.review.taskName,
//       managerReview: this.review.managerReview,
//       reviewDate: this.review.reviewDate,
//       employee: { id: this.review.employee.id },
//       task: { id: this.review.task.id }
//     };

//     if (!this.isEdit) {
     
//       const isDuplicate = this.reviews.some(r =>
//         r.employee.id === this.review.employee.id &&
//         r.task.id === this.review.task.id
//       );

//        if (isDuplicate) {
     
//       alert('⚠️ Review already exists for this employee and task.');
//       return;
//     }

//       this.service.createReview(payload).subscribe(() => {
//         this.toastr.success('Review added successfully');
//         this.loadReviews();
//         this.resetForm();
//       });

//     } else {
      
//       const noChanges =
//         this.originalReview &&
//         this.originalReview.employee.id === this.review.employee.id &&
//         this.originalReview.task.id === this.review.task.id &&
//         this.originalReview.taskName === this.review.taskName &&
//         this.originalReview.managerReview === this.review.managerReview &&
//         this.originalReview.reviewDate === this.review.reviewDate;

//       if (noChanges) {
//         this.toastr.info('No changes made to the review.');
//         return;
//       }

//       this.service.updateReview(this.review.reviewId!, payload).subscribe(() => {
//         this.toastr.success('Review updated successfully');
//         this.loadReviews();
//         this.resetForm();
//       });
//     }
//   }

//   editReview(r: PerformanceReview) {
//     this.isEdit = true;
//     this.review.reviewId = r.reviewId;
//     this.review.employee.id = r.employee?.id ?? 0;
//     this.review.task.id = r.task?.id ?? 0;
//     this.review.taskName = r.taskName;
//     this.review.managerReview = r.managerReview;
//     this.review.reviewDate = r.reviewDate;

//     this.originalReview = JSON.parse(JSON.stringify(this.review));

//     this.service.getTasksByEmployeeId(this.review.employee.id).subscribe((res: Task[]) => {
//       this.tasks = res;
//       const selectedTask = this.tasks.find(t => t.id === this.review.task.id);
//       if (selectedTask) {
//         this.review.taskName = selectedTask.taskName;
//       }
//     });
//   }

//   deleteReview(id: number) {
//     if (confirm('Are you sure you want to delete this review?')) {
//       this.service.deleteReview(id).subscribe(() => {
//         this.toastr.success('Review deleted successfully');
//         this.loadReviews();
//       });
//     }
//   }

//   resetForm() {
//     this.review = {
//       taskName: '',
//       managerReview: '',
//       reviewDate: '',
//       employee: { id: 0 },
//       task: { id: 0 },
//       description: ''
//     };
//     this.tasks = [];
//     this.isEdit = false;
//     this.originalReview = null;
    
//   }
// }


import { Component, inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {
  PerformanceReviewService,
  PerformanceReview,
  Task
} from '../../../services/performance-review.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  selector: 'app-manager-review',
  templateUrl: './manager-review.component.html',
  styleUrls: ['./manager-review.component.css']
})
export class ManagerReviewComponent implements OnInit {
  service = inject(PerformanceReviewService);
  toastr = inject(ToastrService);

  tasks: Task[] = [];
  reviews: PerformanceReview[] = [];
  isEdit = false;
  originalReview: PerformanceReview | null = null;

  minDate: string = new Date().toISOString().split('T')[0];

  review: PerformanceReview = {
    taskName: '',
    managerReview: '',
    reviewDate: '',
    employee: { id: 0 },
    task: { id: 0 },
    description: ''
  };

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.service.getAllReviews().subscribe((res: any[]) => {
      this.reviews = res.map(r => ({
        ...r,
        employee: { id: r.employeeId ?? 0 },
        task: { id: r.taskId ?? 0 }
      }));
      console.log('✅ Reviews loaded:', this.reviews);
    });
  }

  onEmployeeIdEntered(empId: number) {
    if (empId) {
      this.review.employee.id = empId;
      this.service.getTasksByEmployeeId(empId).subscribe((res: Task[]) => {
        this.tasks = res;
        this.review.task = { id: 0 };
        this.review.taskName = '';
      });
    }
  }

  onTaskChange(taskId: number) {
    const selectedTask = this.tasks.find(t => t.id === +taskId);
    if (selectedTask) {
      this.review.task.id = selectedTask.id;
      this.review.taskName = selectedTask.taskName;
    }
  }

  submitReview(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      this.toastr.error('Please fill in all required fields');
      return;
    }

    const payload = {
      reviewId: this.review.reviewId,
      taskName: this.review.taskName,
      managerReview: this.review.managerReview,
      reviewDate: this.review.reviewDate,
      employee: { id: this.review.employee.id },
      task: { id: this.review.task.id }
    };

    if (!this.isEdit) {
      // ✅ Submit new review, handle backend duplicate error via toastr
      this.service.createReview(payload).subscribe({
        next: () => {
          this.toastr.success('Review added successfully');
          this.loadReviews();
          this.resetForm();
        },
        error: (error) => {
          const errMsg = error?.error?.message || 'Something went wrong!';
          this.toastr.error(errMsg);
        }
      });
    } else {
      // ✅ Update review
      const noChanges =
        this.originalReview &&
        this.originalReview.employee.id === this.review.employee.id &&
        this.originalReview.task.id === this.review.task.id &&
        this.originalReview.taskName === this.review.taskName &&
        this.originalReview.managerReview === this.review.managerReview &&
        this.originalReview.reviewDate === this.review.reviewDate;

      if (noChanges) {
        this.toastr.info('No changes made to the review.');
        return;
      }

      this.service.updateReview(this.review.reviewId!, payload).subscribe({
        next: () => {
          this.toastr.success('Review updated successfully');
          this.loadReviews();
          this.resetForm();
        },
        error: (error) => {
          const errMsg = error?.error?.message || 'Update failed!';
          this.toastr.error(errMsg);
        }
      });
    }
  }

  editReview(r: PerformanceReview) {
    this.isEdit = true;
    this.review.reviewId = r.reviewId;
    this.review.employee.id = r.employee?.id ?? 0;
    this.review.task.id = r.task?.id ?? 0;
    this.review.taskName = r.taskName;
    this.review.managerReview = r.managerReview;
    this.review.reviewDate = r.reviewDate;

    this.originalReview = JSON.parse(JSON.stringify(this.review));

    this.service.getTasksByEmployeeId(this.review.employee.id).subscribe((res: Task[]) => {
      this.tasks = res;
      const selectedTask = this.tasks.find(t => t.id === this.review.task.id);
      if (selectedTask) {
        this.review.taskName = selectedTask.taskName;
      }
    });
  }

  deleteReview(id: number) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.service.deleteReview(id).subscribe(() => {
        this.toastr.success('Review deleted successfully');
        this.loadReviews();
      });
    }
  }

  resetForm() {
    this.review = {
      taskName: '',
      managerReview: '',
      reviewDate: '',
      employee: { id: 0 },
      task: { id: 0 },
      description: ''
    };
    this.tasks = [];
    this.isEdit = false;
    this.originalReview = null;
  }
}
