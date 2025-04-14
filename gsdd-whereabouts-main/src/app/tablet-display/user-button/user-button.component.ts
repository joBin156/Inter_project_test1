import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from 'src/service/employee-account.service';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TimeInOutModalService } from 'src/service/time-in-out-modal.service';
import { TimeInOutService } from 'src/service/time-in-out.service';

@Component({
    selector: 'app-user-button',
    templateUrl: './user-button.component.html',
    styleUrls: ['./user-button.component.css'],
    standalone: false
})
export class UserButtonComponent implements OnInit {

    @Input() user: any;
    @Input() statusData: any;

    visible: boolean = false;
    pinControl = new FormControl('');
    loginAttempt: number = 0;
    timeInAndOutVisible: boolean = false;

    public currentDate?: string;
    private timeInDate: string | undefined;
    private timeOutDate: string | undefined;
    private timeInTime: string | undefined = '--';
    private timeOutTime: string | undefined = '--';

    timeDisplay = '';
    timeDisplayModified = false;

    check_time_out: boolean = false;

    constructor(
        private messageService: MessageService,
        private accountService: AccountService,
        private timeInOutModalService: TimeInOutModalService,
        private timeInOutService: TimeInOutService,
    ) {
        setInterval(() => {
            if (!this.timeDisplayModified) {
                let date = new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
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
        const Id = localStorage.getItem('id');
        return Id;
    }

    timeOutId = '';

    timeIn() {
        this.closeTimeInOutModal();
        this.setTimeIn(this.timeDisplay);
        this.timeInDate = this.currentDate;

        let timeInDateTime = new Date(`${this.timeInDate} ` + this.getTimeIn());

        this.timeInAndOutVisible = false;

        const Id = localStorage.getItem('id');
        if (Id) {
            this.timeInOutService.timeIn(Id, timeInDateTime).subscribe(
                (res) => {
                    // clear cookies
                    localStorage.clear();
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Time in Success' });
                },
                (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err });
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
        this.timeInAndOutVisible = false;

        if (this.getTimeIn() !== '--') {

            this.timeInOutService
                .timeOut(this.timeOutId.toString(), timeOutDateTime)
                .subscribe(
                    (res) => {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Time out Success' });
                        this.check_time_out = true;
                    },
                    (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err });
                        console.log(err);
                    },
                );

            this.timeInOutService.getTotalTime(this.timeOutId).subscribe((res) => {
                this.timeInOutService
                    .setTotalTime(this.timeOutId, res.total_time)
                    .subscribe(
                        (res_total_time) => {
                            // clear cookies
                            localStorage.clear();
                        },
                        (err) => {
                            console.log(err);
                        },
                    );
            }, (err) => {
                console.log(err);
            });
        } else {
            console.error('Invalid Id1');
        }
    }

    isTimeIn() {
        const Id = localStorage.getItem('id');
        if(!Id){
           return;
        }

        this.timeInOutService.isTimeIn(Id).subscribe((res) => {
            if (res.dataOfTimeIn) {
                this.setTimeIn(res.dataOfTimeIn);
                this.timeOutId = res.Id;
            } else {
                
            }
        },(err)=>{
            
        });
    }

    isTimeOut() {
        const Id = localStorage.getItem('id');
        if(!Id){
            
        }

        this.timeInOutService.isTimeOut(Id).subscribe((res) => {
            if (res.dataOfTimeOut) {
                this.setTimeOut(res.dataOfTimeOut);
                this.check_time_out = true;
            } else {
                
            }
        },(err)=>{

        });
    }

    showDialog() {
        this.visible = true;
    }

    closeDialog() { }

    signIn() {
        const pin = this.pinControl.value;
        const first_name = this.user.first_name;
        const last_name = this.user.last_name;

        if (!pin) {
            return this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Pin is required',
            });
        }

        const lastFailedLoginTime = localStorage.getItem('lastFailedLoginTime');

        if (lastFailedLoginTime) {
            const currentTime = new Date().getTime();
            const timeDifference = currentTime - parseInt(lastFailedLoginTime, 10);

            //If less than 20minutes show error and return
            if (timeDifference < 20 * 60 * 1000) {
                const remainingTime = Math.ceil(20 * 60 * 1000 - timeDifference / 1000);

                this.messageService.add({
                    severity: 'error',
                    summary: 'Login failed',
                    detail: `Too many login attempts. Try again in ${remainingTime} seconds`,
                });
                return;
            }
        }

        this.accountService.loginTablet(first_name, last_name, pin).subscribe(
            (account) => {
                if (!account.verified) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Login failed',
                        detail: 'Account not verified.',
                    });
                    return;
                }

                if (account.verified === 'Disabled') {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Login failed',
                        detail: 'Account is disabled. Contact your administrator',
                    });
                    return;
                }

                this.loginAttempt = 0;
                localStorage.removeItem('lastFailedLoginTime');

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Login success',
                });

                localStorage.setItem('id', account.Id);
                this.isTimeIn();
                this.isTimeOut();

                this.visible = false;
                this.timeInAndOutVisible = true;
                this.openTimeInOutModal();
            },
            (err) => {
                this.loginAttempt++;

                if (this.loginAttempt == 5) {
                    localStorage.setItem(
                        'lastFailedLoginTime',
                        new Date().getTime().toString(),
                    );

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Login Failed',
                        detail: 'Too many login attempts. Try again in 20minutes',
                    });
                } else {
                    console.error(err);

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Login Failed',
                        detail: 'Invalid. Please try again',
                    });
                }
            },
        );

        // if (this.pinControl.value === "123") {
        //     console.log("Pin is correct!");
        //     console.log(this.user);
        //     this.visible = false;
        // } else {
        //     console.log('Pin is incorrect');
        // }
    }

    reset() {
        this.pinControl.reset();
    }

    resetStorage() {
        localStorage.clear();
    }
}
