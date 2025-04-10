import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  basicData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    datasets: [
      {
        label: 'Present',
        backgroundColor: '#42A5F5',
        data: [5, 10, 18, 16, 13],
      },
      {
        label: 'Absent',
        backgroundColor: '#9CCC65',
        data: [6, 14, 21, 12, 7],
      },
    ],
  };

  basicOptions = {
    title: {
      display: true,
      text: 'My Title',
      fontSize: 16,
    },
    legend: {
      position: 'bottom',
    },
  };
}
