import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-helpdesk',
  standalone: true,
  imports: [],
  templateUrl: './helpdesk.component.html',
  styleUrl: './helpdesk.component.css'
})
export class HelpdeskComponent {
  
    selectedTab = signal<'active' | 'closed'>('active');
   
    setTab(tab: 'active' | 'closed') {
      this.selectedTab.set(tab);
    }
   
    isActiveTab(tab: 'active' | 'closed') {
      return this.selectedTab() === tab;
    }
}