import { Component, OnInit } from '@angular/core';
import { TimeInOutService } from 'src/service/time-in-out.service';
import { EmployeeAttendanceService } from 'src/service/employee-attendance.service';
import { EmployeeAttendance } from 'src/domain/employee-attendance';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';

interface WeeklyStats {
  labels: string[];
  present: number[];
  absent: number[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  getTotalTime: string = 'Not configured';
  frequentStatus: string = 'Not configured';
  longestStreak: string = 'Not configured';
  userId: string = '';
  basicData?: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] };
  basicOptions: any;
  allowedStartMin = 0;
  allowedEndMin = 24 * 60;

  constructor(
    private timeInOutService: TimeInOutService,
    private employeeAttendanceService: EmployeeAttendanceService
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      this.userId = storedId;
      forkJoin([
        this.employeeAttendanceService.getEmployeeAttendanceData(),
        this.timeInOutService.getTimeInAndOut(this.userId)
      ]).subscribe(([attendanceData, timeInOutData]) => {
        this.calculateTotalTime(timeInOutData);
        this.getFrequentStatus(attendanceData as EmployeeAttendance[]);
        this.getLongestStreak(attendanceData as EmployeeAttendance[]);
        this.loadAllowedTimeAndChart();
      });
    }
  }

  private calculateTotalTime(timeInOutData: any): void {
    this.getTotalTime = timeInOutData?.totalTime || '0h 0m';
  }

  private getFrequentStatus(data: EmployeeAttendance[]): void {
    const statusCounts: Record<string, number> = {};
    data.forEach(record => {
      const status = record.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    this.frequentStatus = Object.entries(statusCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'On Time';
  }

  private getLongestStreak(data: EmployeeAttendance[]): void {
    let currentStreak = 0;
    let maxStreak = 0;
    let lastDate: string | null = null;

    data
      .map(r => new Date(r.time_in))
      .sort((a, b) => a.getTime() - b.getTime())
      .forEach(date => {
        const dayString = date.toDateString();
        if (lastDate && new Date(lastDate).getTime() + 86400000 === date.getTime()) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        maxStreak = Math.max(maxStreak, currentStreak);
        lastDate = dayString;
      });

    this.longestStreak = `${maxStreak} days`;
  }

  private loadAllowedTimeAndChart(): void {
    this.timeInOutService.getAllowedTime().subscribe(cfg => {
      this.allowedStartMin = this.toMinutes(this.to24(cfg.startTime));
      this.allowedEndMin = this.toMinutes(this.to24(cfg.endTime));
      this.loadChartData();
      this.loadChartOptions();
    });
  }

  private loadChartData(): void {
    if (!this.userId) return;

    this.employeeAttendanceService.getEmployeeAttendanceData().subscribe(
      (data: EmployeeAttendance[]) => {
        const userRecords = data.filter(record => record.employee_id === this.userId);
        const stats = this.getWeeklyAttendanceStats(userRecords);
        this.basicData = {
          labels: stats.labels,
          datasets: [
            {
              label: 'Present',
              data: stats.present,
              backgroundColor: '#42A5F5'
            },
            {
              label: 'Absent',
              data: stats.absent,
              backgroundColor: '#FFA726'
            }
          ]
        };
      },
      err => console.error('Error loading chart data:', err)
    );
  }

  private loadChartOptions(): void {
    this.basicOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Weekly Attendance' }
      }
    };
  }

  private getWeeklyAttendanceStats(data: EmployeeAttendance[]): WeeklyStats {
    const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const present = [0, 0, 0, 0, 0];
    const absent = [0, 0, 0, 0, 0];

    data.forEach(record => {
      const date = new Date(record.time_in);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const idx = labels.indexOf(day);
      if (idx === -1) return;
      const minute = date.getHours() * 60 + date.getMinutes();
      if (minute >= this.allowedStartMin && minute <= this.allowedEndMin) {
        present[idx]++;
      } else {
        absent[idx]++;
      }
    });

    return { labels, present, absent };
  }

  generateExcelTimesheet(): void {
    const basicData = this.basicData;
    if (!basicData) {
      console.warn('No chart data to export');
      return;
    }
    const rows = basicData.labels.map((day, i) => ({
      Day: day,
      Present: basicData.datasets[0].data[i],
      Absent: basicData.datasets[1].data[i]
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, 'WeeklyAttendance.xlsx');
  }

  private to24(input: string): string {
    const [time, mod] = input.split(' ');
    let [h, m] = time.split(':').map(v => parseInt(v, 10));
    if (mod === 'PM' && h < 12) h += 12;
    if (mod === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  private toMinutes(input24: string): number {
    const [h, m] = input24.split(':').map(Number);
    return h * 60 + m;
  }
}
