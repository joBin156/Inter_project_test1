import { Component, OnInit } from '@angular/core';
import { TimeInOutService, AllowedTime } from 'src/service/time-in-out.service';
import { EmployeeAttendanceService } from 'src/service/employee-attendance.service';
import { EmployeeAttendance } from 'src/domain/employee-attendance';
import { TimesheetComponent } from '../timesheet/timesheet.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  getTotalTime = 'Not configured';
  frequentStatus = 'Not configured';
  longestStreak = 'Not configured';
  userId = '';

  // Allowed time window (in minutes since midnight)
  private allowedStartMin = 0;
  private allowedEndMin = 24 * 60;

  basicData: any;
  basicOptions: any;

  constructor(
    private timeInOutService: TimeInOutService,
    private employeeAttendanceService: EmployeeAttendanceService,
    private employeeAttendance: EmployeeAttendance
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      this.userId = storedId;
      this.formattedItem();
      this.getFrequentStatus();
      this.getLongestStreak();
      this.loadAllowedTimeAndChart();
    }
  }

  private loadAllowedTimeAndChart(): void {
    this.timeInOutService.getAllowedTime().subscribe((cfg: AllowedTime) => {
      const to24 = this.to24;
      const toMin = this.toMinutes;
      this.allowedStartMin = toMin(to24(cfg.startTime));
      this.allowedEndMin = toMin(to24(cfg.endTime));

      // Now set chart with attendance
      this.setChartData(data: any);
      this.setChartOptions();
    });
  }

  private to24(input: string): string {
    const [time, mod] = input.split(' ');
    let [h, m] = time.split(':').map(v => parseInt(v, 10));
    if (mod === 'PM' && h < 12) h += 12;
    if (mod === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
  }

  private toMinutes(input24: string): number {
    const [h, m] = input24.split(':').map(v => Number(v));
    return h * 60 + m;
  }

  formattedItem(): void {
    this.timeInOutService.getTimeInAndOut(this.userId).subscribe(
      res => {this.getTotalTime = res.formattedItem;}, 
      err => console.error('Error fetching total time:', err)
    );
  }

  getFrequentStatus(): void {
    this.employeeAttendanceService.getEmployeeAttendanceData().subscribe(data => {
      const statusCounts = data.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});
      this.frequentStatus = Object.entries(statusCounts)
        .sort((a, b) => b[1] - a[1])[0][0] || 'On Time';
    });
  }

  getLongestStreak(): void {
    this.employeeAttendanceService.getEmployeeAttendanceData().subscribe(data => {
      let currentStreak = 0;
      let maxStreak = 0;
      
      data.sort((a, b) => new Date(a.time_in).getTime() - new Date(b.time_in).getTime())
          .forEach((record, i) => {
        if (record.status === 'Present') {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });
      
      this.longestStreak = `${maxStreak} days`;
    });
  }

  interface WeeklyStats {
    [key: string]: { present: number; absent: number };
  }

  private getWeeklyAttendanceStats(att: EmployeeAttendance[]): WeeklyStats {
    const stats: WeeklyStats = {
      Monday: { present: 0, absent: 0 },
      Tuesday: { present: 0, absent: 0 },
      Wednesday: { present: 0, absent: 0 },
      Thursday: { present: 0, absent: 0 },
      Friday: { present: 0, absent: 0 },
    };

    att.forEach((record: EmployeeAttendance) => {
      const inTime = record.time_in;
      const day = new Date(inTime).toLocaleDateString('en-US', { weekday: 'long' }) as keyof WeeklyStats;
      if (!stats[day]) return;

      const minuteOfDay = this.toMinutes((new Date(inTime)).toTimeString().slice(0,5));
      // Present if within allowed window
      if (minuteOfDay >= this.allowedStartMin && minuteOfDay <= this.allowedEndMin) {
        stats[day].present++;
      } else {
        stats[day].absent++;
      }
    });
    return stats;
  }

  private setChartData(): void {
    this.employeeAttendanceService.getEmployeeAttendanceData().subscribe((data: EmployeeAttendance[]) => {
      const stats = this.getWeeklyAttendanceStats(data) as WeeklyStats;
      this.basicData = {
        labels: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
        datasets: [
          { label: 'Present', data: [stats.Monday.present, stats.Tuesday.present, stats.Wednesday.present, stats.Thursday.present, stats.Friday.present] },
          { label: 'Absent', data: [stats.Monday.absent, stats.Tuesday.absent, stats.Wednesday.absent, stats.Thursday.absent, stats.Friday.absent] }
        ],
      };
    });
  }

  private setChartOptions(): void {
    this.basicOptions = {
      responsive: true,
      plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Attendance Chart' } }
    };
  }

  generateExcelTimesheet(): void {
    // unchanged...
  }
}
