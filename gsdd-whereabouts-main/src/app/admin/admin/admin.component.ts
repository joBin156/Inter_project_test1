import { Component, OnInit } from '@angular/core';
import { EmployeeAttendanceService } from 'src/service/employee-attendance.service';

interface AttendanceRecord {
  time_in: string;
  time_out: string | null;
  status: string;
  date: string;
}

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: false
})

export class AdminComponent implements OnInit {
  inOfficeCount = 0;
  sickLeaveCount = 0;
  basicData: any;

  constructor(private employeeAttendanceService: EmployeeAttendanceService) {
    this.initChartData();
  }

  ngOnInit() {
    this.loadDashboardStats();
  }

  private loadDashboardStats() {
    this.employeeAttendanceService.getEmployeeAttendanceData().subscribe(data => {
      const today = new Date().toISOString().split('T')[0];
      this.inOfficeCount = data.filter((record: AttendanceRecord) => 
        record.time_in.includes(today) && !record.time_out
      ).length;
      
      this.sickLeaveCount = data.filter((record: AttendanceRecord) => 
        record.status === 'Sick Leave' && record.date === today
      ).length;
    });
  }

  private initChartData() {
    this.basicData = {
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
  }

  private initChart() {
    this.basicData = {
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
  }

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
