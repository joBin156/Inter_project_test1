import { Component, OnInit } from '@angular/core';
import { TimeInOutService } from 'src/service/time-in-out.service';
import { EmployeeAttendanceService } from 'src/service/employee-attendance.service';
import { EmployeeAttendance } from 'src/domain/employee-attendance';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';

interface WeeklyStats {
  [key: string]: { present: number; absent: number };
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
  basicData: { labels: string[]; datasets: { label: string; data: number[] }[] } | undefined;
  basicOptions: { responsive: boolean; plugins: any } | undefined;
  allowedStartMin: number = 0;
  allowedEndMin: number = 24 * 60;

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
        this.timeInOutService.getTimeInAndOut(this.userId),
      ]).subscribe(([attendanceData, timeInOutData]) => {
        //this.getFrequentStatus(attendanceData as EmployeeAttendance[]);
        this.getLongestStreak(attendanceData as EmployeeAttendance[]);
        this.loadAllowedTimeAndChart();
      });
    }
  }

  private loadAllowedTimeAndChart(): void {
    this.timeInOutService.getAllowedTime().subscribe((cfg) => {
      this.allowedStartMin = this.toMinutes(this.to24(cfg.startTime));
      this.allowedEndMin = this.toMinutes(this.to24(cfg.endTime));
      this.loadChartData();
      this.loadChartOptions();
    });
  }

  private to24(input: string): string {
    const [time, mod] = input.split(' ');
    let [h, m] = time.split(':').map((v) => parseInt(v, 10));
    if (mod === 'PM' && h < 12) h += 12;
    if (mod === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  private toMinutes(input24: string): number {
    const [h, m] = input24.split(':').map((v) => Number(v));
    return h * 60 + m;
  }

  getFrequentStatus(): void {
    this.employeeAttendanceService.getEmployeeAttendanceData().subscribe(data => {
      const statusCounts: { [key: string]: number } = {};
  
      data.forEach((record: EmployeeAttendance) => {
        const status = record.status || 'Unknown'; // Handle undefined status
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
  
      this.frequentStatus = Object.entries(statusCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'On Time'; // Default to 'On Time'
    });
  }
  
  getLongestStreak(attendanceData: EmployeeAttendance[]): void {
    let currentStreak = 0;
    let maxStreak = 0;

    attendanceData
      .filter((record) => record.time_in)
      .sort(
        (a, b) =>
          new Date(a.time_in).getTime() - new Date(b.time_in).getTime()
      )
      .forEach((record) => {
        if (record.status === 'Present') {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });

    this.longestStreak = `${maxStreak} days`;
  }

  private getWeeklyAttendanceStats(
    attendance: EmployeeAttendance[]
  ): WeeklyStats {
    const stats: Record<string, { present: number; absent: number }> = {
      Monday: { present: 0, absent: 0 },
      Tuesday: { present: 0, absent: 0 },
      Wednesday: { present: 0, absent: 0 },
      Thursday: { present: 0, absent: 0 },
      Friday: { present: 0, absent: 0 },
    };

    attendance.forEach((record) => {
      const inTime = record.time_in;
      const day = new Date(inTime).toLocaleDateString('en-US', { weekday: 'long' });
      if (!stats[day]) return;

      const minuteOfDay = this.toMinutes(new Date(inTime).toTimeString().slice(0, 5));
      if (minuteOfDay >= this.allowedStartMin && minuteOfDay <= this.allowedEndMin) {
        stats[day].present++;
      } else {
        stats[day].absent++;
      }
    });
    return stats;
  }

  private loadChartData(): void {
    this.employeeAttendanceService.getEmployeeAttendanceData().subscribe(
      (data: EmployeeAttendance[]) => {
        const stats = this.getWeeklyAttendanceStats(data);
        this.basicData = {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          datasets: [
            {
              label: 'Present',
              data: [
                stats['Monday'].present,
                stats['Tuesday'].present,
                stats['Wednesday'].present,
                stats['Thursday'].present,
                stats['Friday'].present,
              ],
            },
            {
              label: 'Absent',
              data: [
                stats['Monday'].absent,
                stats['Tuesday'].absent,
                stats['Wednesday'].absent,
                stats['Thursday'].absent,
                stats['Friday'].absent,
              ],
            },
          ],
        };
      },
      (err) => console.error('Error loading chart data:', err)
    );
  }

  private loadChartOptions(): void {
    this.basicOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Attendance Chart' },
      },
    };
  }

  generateExcelTimesheet(): void {
    const ws = XLSX.utils.json_to_sheet(this.basicData?.datasets || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, 'Attendance_Timesheet.xlsx');
  }
}
