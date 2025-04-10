import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrlAPI = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAccountsData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrlAPI}users`);
  }

  login(email: string, pin: string): Observable<any> {
    return this.http.post(`${this.baseUrlAPI}login`, { email, pin });
  }

  submitAccount(
    first_name: string,
    last_name: string,
    email: string,
    position: string,
    pin: string,
    role: string,
  ) {
    return this.http.post(`${this.baseUrlAPI}register`, {
      first_name,
      last_name,
      email,
      position,
      pin,
      role,
    });
    // console.log({first_name, last_name, email, position, password, role})
  }

  validateAccount(emailToken: string) {
    return this.http.get<any>(
      `${this.baseUrlAPI}confirm/?emailToken=${emailToken}`,
    );
  }

  getCurrentUser(): Observable<any> {
    const userId = localStorage.getItem('id');
    return this.http.get<any>(`${this.baseUrlAPI}user/${userId}`);
  }

  loginTablet(first_name: string, last_name: string, pin: string): Observable<any>{
    return this.http.post(`${this.baseUrlAPI}tablet_login`, { first_name, last_name, pin });
  }

  changePin(Id: string | null, newPin: string): Observable<any> {
    return this.http.put(`${this.baseUrlAPI}change_pin/${Id}`, { newPin });
  }

  rowEditSave(Id: string, first_name: string, last_name: string, position: string, email: string, role: string, verified: boolean){
    return this.http.put(`${this.baseUrlAPI}row_edit_save`, {Id, first_name, last_name, position, email, role, verified})
  }
}
