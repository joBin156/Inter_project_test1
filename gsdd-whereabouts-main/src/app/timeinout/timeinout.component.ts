import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TabService } from 'src/service/tab.service';
import { TimeInOutModalService } from 'src/service/time-in-out-modal.service';
import { TimeInOutService, } from 'src/service/time-in-out.service';
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

  constructor(
    private tabService: TabService,
    private timeInOutModalService: TimeInOutModalService,
    private timeInOutService: TimeInOutService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
  ) {
    setInterval(() => {
      this.CURRENT_TIME_DISPLAY_ONLY = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      if (!this.timeDisplayModified) {
        let date = new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        });

        let time = new Date().toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        let hours = new Date().getHours().toString().padStart(2, '0');
        let minutes = new Date().getMinutes().toString().padStart(2, '0');
        let seconds = new Date().getSeconds().toString().padStart(2, '0');

        this.timeDisplay = `${hours}:${minutes}:${seconds}`;

        this.currentDate = `${date}`;
      }
    }, 1000);
  }

  isOpen$ = this.timeInOutModalService.isOpen$;

  ngOnInit(): void {
    this.timeInOutModalService.closeModal();

    this.isTimeIn();
    this.isTimeOut();
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

    let timeInDateTime = new Date(`${this.timeInDate} ` + this.getTimeIn());

    if (this.Id) {
      this.timeInOutService.timeIn(this.Id, timeInDateTime).subscribe(
        (res) => {
          this.timeOutId = res.Id;
        },
        (err) => {
          console.log(err);
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

    let timeOutDateTime = new Date(`${this.timeOutDate} ` + this.getTimeOut());

    if (this.getTimeIn() !== '--') {

      this.timeInOutService
        .timeOut(this.timeOutId.toString(), timeOutDateTime)
        .subscribe(
          (res) => {
            this.check_time_out = true;
          },
          (err) => {
            console.log(err);
          },
        );

      this.timeInOutService.getTotalTime(this.timeOutId).subscribe(
        (res) => {
          this.timeInOutService
            .setTotalTime(this.timeOutId, res.total_time)
            .subscribe(
              (res_total_time) => {
              },
              (err) => {
                console.log(err);
              },
            );
        },
        (err) => {
          console.log(err);
        },
      );
    } else {
      console.error('Invalid Id1');
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
}
