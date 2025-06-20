import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { SeniorHrSidebarComponent } from "../../sidebars/senior-hr-sidebar/senior-hr-sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-senior-hr-layout',
  standalone: true,
  imports: [NavbarComponent,RouterOutlet, SeniorHrSidebarComponent],
  templateUrl: './senior-hr-layout.component.html',
  styleUrl: './senior-hr-layout.component.css'
})
export class SeniorHrLayoutComponent {

}
