import { ChangeDetectorRef, Component, OnInit, Injector } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TabService } from 'src/service/tab.service';
import { TimeInOutModalService } from 'src/service/time-in-out-modal.service';
import { TimeInOutService } from 'src/service/time-in-out.service';
import { EmployeeAttendanceService } from 'src/service/employee-attendance.service'; // Adjust the path as necessary
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-timeinout',
    templateUrl: './timeinout.component.html',
    styleUrls: ['./timeinout.component.css'],
    standalone: false
})
export class TimeinoutComponent implements OnInit {
  CURRENT_TIME_DISPLAY_ONLY?: string;
  public currentDate?: string;

  private timeInDate: string | undefined;
  private timeOutDate: string | undefined;
  private timeInTime: string | undefined = '--';
  private timeOutTime: string | undefined = '--';

  timeDisplay = '';
  timeDisplayModified = false;

  Id = localStorage.getItem('id');

  check_time_out: boolean = false;
  attendanceData: any[] = [];
  miniAttendanceData: any[] = [];

  constructor(
    private tabService: TabService,
    private timeInOutModalService: TimeInOutModalService,
    private timeInOutService: TimeInOutService,
    private employeeAttendanceService: EmployeeAttendanceService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private injector: Injector,
  ) {}

  isOpen$ = this.timeInOutModalService.isOpen$;

  ngOnInit(): void {
    this.timeInOutModalService.closeModal();

    interval(1000).subscribe(() => {
      this.CURRENT_TIME_DISPLAY_ONLY = this.formatDate(new Date(), {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      if (!this.timeDisplayModified) {
        this.timeDisplay = this.formatDate(new Date(), {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        this.currentDate = this.formatDate(new Date(), {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        });
      }
      this.cdr.detectChanges();
    });

    this.isTimeIn();
    this.isTimeOut();
    this.fetchAttendanceData();
    this.fetchMiniAttendanceData();
  }

  openTimeInOutModal() {
    this.timeInOutModalService.openModal();
  }

  closeTimeInOutModal() {
    this.timeDisplayModified = false;
    this.timeInOutModalService.closeModal();
  }

  onTimeChange(event: any) {
    this.timeDisplayModified = true;
    this.timeDisplay = event;
  }

  getTimeIn() {
    return this.timeInTime;
  }

  setTimeIn(timeIn?: string) {
    this.timeInTime = timeIn;
  }

  getTimeOut() {
    return this.timeOutTime;
  }

  setTimeOut(timeOut?: string) {
    this.timeOutTime = timeOut;
  }

  getId() {
    return this.Id;
  }

  timeOutId = '';

  timeIn() {
    this.timeInOutModalService.closeModal();
    this.setTimeIn(this.timeDisplay);
    this.timeInDate = this.currentDate;

    let timeInDateTime = new Date(`${this.timeInDate} ${this.getTimeIn()}`);

    if (this.Id) {
      this.timeInOutService.timeIn(this.Id, timeInDateTime).subscribe(
        (res) => {
          this.timeOutId = res.Id;
        },
        (err) => {
          console.error('Error during time-in:', err);
        },
      );
    } else {
      console.error('No Id');
    }
  }

  timeOut() {
    this.timeInOutModalService.closeModal();
    this.setTimeOut(this.timeDisplay);
    this.timeOutDate = this.currentDate;

    let timeOutDateTime = new Date(`${this.timeOutDate} ${this.getTimeOut()}`);

    if (this.getTimeIn() !== '--') {
      this.timeInOutService
        .timeOut(this.timeOutId.toString(), timeOutDateTime)
        .pipe(
          switchMap(() => this.timeInOutService.getTotalTime(this.timeOutId)),
          switchMap((res) => this.timeInOutService.setTotalTime(this.timeOutId, res.total_time))
        )
        .subscribe(
          () => {
            this.check_time_out = true;
          },
          (err) => {
            console.error('Error during time-out or setting total time:', err);
          },
        );
    } else {
      console.error('Invalid Id for time-out');
    }
  }

  isTimeIn() {
    this.timeInOutService.isTimeIn(this.Id).subscribe((res) => {
      if (res.dataOfTimeIn) {
        this.setTimeIn(res.dataOfTimeIn);
        this.timeOutId = res.Id;
      } else {
        console.log('No time in');
      }
    });
  }

  isTimeOut() {
    this.timeInOutService.isTimeOut(this.Id).subscribe((res) => {
      if (res.dataOfTimeOut) {
        this.setTimeOut(res.dataOfTimeOut);
        this.check_time_out = true;
      } else {
        console.log('No time out');
      }
    });
  }

  goToTimeSheet() {
    this.tabService.changeTab(1);
  }

  fetchAttendanceData() {
    this.employeeAttendanceService.getEmployeeAttendanceData().subscribe(
      (data) => {
        console.log('Fetched attendance data:', data);
        this.attendanceData = data;
      },
      (error) => {
        console.error('Error fetching attendance data:', error);
      }
    );
  }

  fetchMiniAttendanceData() {
    this.employeeAttendanceService.getEmployeeAttendanceData().subscribe(
      (data) => {
        console.log('Fetched attendance data:', data);
        this.attendanceData = data ?? []; // Fallback to an empty array
      },
      (error) => {
        console.error('Error fetching attendance data:', error);
        this.attendanceData = []; // Fallback to an empty array in case of error
      }
    );
  }
  

  private formatDate(date: Date, options: Intl.DateTimeFormatOptions): string {
    return date.toLocaleString('en-US', options);
  }
}
