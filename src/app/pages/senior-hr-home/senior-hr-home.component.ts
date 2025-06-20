import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-senior-hr-home',
  standalone: true,
  imports: [],
  templateUrl: './senior-hr-home.component.html',
  styleUrl: './senior-hr-home.component.css'
})

export class SeniorHrHomeComponent implements OnInit, OnDestroy {

  timeString: string = '';
  private intervalId: any;

  ngOnInit(): void {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  updateTime(): void {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.timeString = `${hours} : ${minutes} : ${seconds}`;
  }
}
