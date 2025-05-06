import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/service/employee-account.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-account-confirmation',
    templateUrl: './account-confirmation.component.html',
    styleUrls: ['./account-confirmation.component.css'],
    standalone: false
})
export class AccountConfirmationComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const emailToken = params['emailToken'];
      this.validateAccount(emailToken);
    });
  }

  validateAccount(emailToken: string) {
    this.accountService.validateAccount(emailToken).subscribe(() => {
     
    });
  }
}
