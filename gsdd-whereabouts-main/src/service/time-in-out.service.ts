import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface TimeInandOutData {
  Id: string;
  time_in: string | null;
  time_out: string | null;
}

export interface AllowedTime {
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root',
})
export class TimeInOutService {
  private baseUrlAPI = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  timeIn(user_Id: string, time_in: Date): Observable<any> {
    return this.http.post(`${this.baseUrlAPI}time_in`, { user_Id, time_in });
  }

  timeOut(time_out_Id: string, time_out: Date): Observable<any> {
    return this.http.put(`${this.baseUrlAPI}time_out/${time_out_Id}`, {
      time_out,
    });
  }

  getTotalTime(time_out_Id: string): Observable<any> {
    return this.http.get(`${this.baseUrlAPI}total_time/${time_out_Id}`);
  }

  setTotalTime(time_out_Id: string, total_time: string): Observable<any> {
    return this.http.put(`${this.baseUrlAPI}set_total_time/${time_out_Id}`, {
      total_time,
    });
  }

  getAllowedTime(): Observable<any> {
    console.log('Making API request to:', `${this.baseUrlAPI}allowed-time`);
    return this.http.get(`${this.baseUrlAPI}allowed-time`);
  }

  setAllowedTime(AllowedTime: string): Observable<any> {
    //const payload = { allowed_Time; AllowedTime };
    return this.http.put(`${this.baseUrlAPI}allowed-time/${AllowedTime}`, {})
  }

  isTimeIn(user_Id: string | null): Observable<any> {
    return this.http.get(`${this.baseUrlAPI}check_time_in_today/${user_Id}`);
  }

  isTimeOut(user_Id: string | null): Observable<any> {
    return this.http.get(`${this.baseUrlAPI}check_time_out_today/${user_Id}`);
  }

  getTimeInAndOut(user_Id: string | null): Observable<any>{
    return this.http.get(`${this.baseUrlAPI}get_time_in_and_out/${user_Id}`);
  }

  updateData(Id: string | null, time_in: Date, time_out: Date): Observable<any>{
    return this.http.put(`${this.baseUrlAPI}update_Data/${Id}`, {time_in ,time_out})
  }
  
  getAllLatestTimeInToday(): Observable<any>{
    return this.http.get(`${this.baseUrlAPI}all_latest_time_in`);
  }

  getAllDataTimeInOut(): Observable<any>{
    return this.http.get(`${this.baseUrlAPI}get_all_data_time_in_out`);
  }
}
