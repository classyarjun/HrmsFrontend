import { CommonModule } from '@angular/common';
import { Component ,signal} from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-hr-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './hr-sidebar.component.html',
  styleUrl: './hr-sidebar.component.css'
})
export class HrSidebarComponent {

  // Signal for sidebar expanded/collapsed
  isExpanded = signal(true);

  // Submenu tracker
  expandedMenus: Set<string> = new Set();

  // Toggle Sidebar
  toggleSidebar(): void {
    this.isExpanded.set(!this.isExpanded());
  }

  // Toggle Submenu
  toggleSubmenu(label: string): void {
    this.expandedMenus.has(label)
      ? this.expandedMenus.delete(label)
      : this.expandedMenus.add(label);
  }

  // Check if submenu is expanded
  isSubmenuExpanded(label: string): boolean {
    return this.expandedMenus.has(label);
  }

}
