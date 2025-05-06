import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'src/service/employee-account.service';
import { Account } from 'src/domain/employee-account';
@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
    standalone: false
})
export class AccountComponent {
  User!: Account;

  constructor(
    private accountService: AccountService,
    private http: HttpClient,
  ) {}
  ngOnInit() {
    const Id = Number(localStorage.getItem('id'));
    this.accountService.getCurrentUser().subscribe((data) => {
      this.User = data;
    });
  }
}
