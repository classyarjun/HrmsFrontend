import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AddEmployeeService } from '../../../services/add-employee.service';

@Component({
  selector: 'app-hr-people',
  standalone: true,
   imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './hr-people.component.html',
  styleUrl: './hr-people.component.css'
})
export class HrPeopleComponent implements OnInit {
  employees: any[] = [];
  starredEmployees: any[] = []; // Add your logic to populate this list

  defaultProfile: string = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
  activeTab: string = 'starred';

  selectedEmployee: any = null;

  searchTerm: string = '';
  starredSearchTerm: string = '';

  constructor(private addEmployeeService: AddEmployeeService) {}

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.addEmployeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        // Dummy logic to populate starredEmployees – replace with your logic
        this.starredEmployees = res.filter((emp: any) => emp.isStarred);
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      },
    });
  }

  filteredEmployees() {
    return this.employees.filter(emp =>
      (`${emp.firstName} ${emp.lastName}`).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filteredStarredEmployees() {
    return this.starredEmployees.filter(emp =>
      (`${emp.firstName} ${emp.lastName}`).toLowerCase().includes(this.starredSearchTerm.toLowerCase())
    );
  }

  selectEmployee(emp: any) {
    this.selectedEmployee = emp;
  }
}

