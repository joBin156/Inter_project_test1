
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

  basicOptions: any;

  constructor(private employeeAttendanceService: EmployeeAttendanceService) {}

  ngOnInit() {
    this.loadDashboardStats();
    this.initChartOptions();
    this.loadChartData();

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

  private loadChartData() {
    this.employeeAttendanceService.getEmployeeAttendanceData().subscribe(data => {
      const weekData = this.processWeeklyData(data);
      this.basicData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [
          {
            label: 'Present',
            backgroundColor: '#42A5F5',
            data: weekData.present
          },
          {
            label: 'Absent',
            backgroundColor: '#FFA726',
            data: weekData.absent
          }
        ]
      };
    });
  }

  private processWeeklyData(data: any[]) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const present = new Array(5).fill(0);
    const absent = new Array(5).fill(0);

    data.forEach(record => {
      const date = new Date(record.time_in);
      const dayIndex = date.getDay() - 1; // Monday is 1
      if (dayIndex >= 0 && dayIndex < 5) {
        if (record.status === 'Present') {
          present[dayIndex]++;
        } else {
          absent[dayIndex]++;
        }
      }
    });

    return { present, absent };
  }

  private initChartOptions() {
    this.basicOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Weekly Attendance Overview',
          fontSize: 16
        }
      },
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }
}
