import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AccountService } from 'src/service/employee-account.service';
import { MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {
  emailControl = new FormControl('');
  pinControl = new FormControl('');
  loginAttempt: number = 0;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('GSDD Personnel Tracking System');
  }
  toast(
    severity: string,
    summary: string,
    detail: string,
    time?: string,
    life?: number,
  ) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000,
    });
  }

  login() {
    const email = this.emailControl.value;
    const pin = this.pinControl.value;
    if (!email || !pin) {
      this.toast('error', 'Error', 'Username and pin are required');
      return;
    }

    const lastFailedLoginTime = localStorage.getItem('lastFailedLoginTime');
    if (lastFailedLoginTime) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - parseInt(lastFailedLoginTime, 10);

      //If less than 20minutes show error and return
      if (timeDifference < 20 * 60 * 1000) {
        const remainingTime = Math.ceil(20 * 60 * 1000 - timeDifference / 1000);
        this.toast(
          'error',
          'Login Failed',
          `Too many login attempts. Try again in ${remainingTime} seconds`,
        );

        return;
      }
    }

    this.accountService.login(email, pin).subscribe(
      (account) => {
        if (!account.verified) {
          this.toast('warn', 'Login failed', 'Account not verified.');

          return;
        }

        if (account.verified === 'Disabled') {
          this.toast(
            'warn',
            'Login failed',
            'Account is disabled. Contact your administrator',
          );
          return;
        }

        localStorage.setItem('token', account.token);
        localStorage.setItem('claims', account.claims.userId);
        localStorage.setItem('id', account.Id);
        localStorage.setItem('role', account.role);
        localStorage.setItem('email', account.email);

        // Reset login attempts and lastFailedLoginTime after successful login
        this.loginAttempt = 0;
        localStorage.removeItem('lastFailedLoginTime');

        // Insert toaster, and navigate to admin
        this.toast('success', 'Success', 'Login success');

        this.router.navigate(['/dashboard']);
      },
      (err) => {
        this.loginAttempt++;

        if (this.loginAttempt == 5) {
          localStorage.setItem(
            'lastFailedLoginTime',
            new Date().getTime().toString(),
          );

          this.toast(
            'error',
            'Login Failed',
            'Too many login attempts. Try again in 20minutes',
          );
        } else {
          console.error(err);
          this.toast(
            'error',
            'Login failed',
            'User is not authenticated. Please try again',
          );
        }
      },
    );
  }
}
