import { Injectable, Inject } from '@angular/core';
import { TimeInOutService } from './time-in-out.service';
import { environment } from 'src/environments/environment';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class EmployeeAttendanceService {
    private baseUrlAPI = `${environment.apiUrl}`;

    constructor(
        //@Inject(EmployeeAttendanceService) 
        //private employeeAttendance: EmployeeAttendanceService,
        private http: HttpClient
    ) {}

    
    // Hard code data
    // getEmployeeAttendanceData() {
    //     return [
    //         {
    //             id: '1',
    //             name: 'Karl Marx',
    //             time_in: new Date('2022-01-01T09:30:00'),
    //             time_out: new Date('2022-01-01T17:00:00'),
    //         },
    //         {
    //             id: '2',
    //             name: 'Roxas',
    //             time_in: new Date('2022-01-01T09:30:00'),
    //             time_out: new Date('2022-01-01T17:00:00'),
    //         },
    //         {
    //             id: '3',
    //             name: 'Marx',
    //             time_in: new Date('2022-01-01T09:30:00'),
    //             time_out: new Date('2022-01-01T17:00:00'),
    //         },
    //         {
    //             id: '4',
    //             name: 'Thea',
    //             time_in: new Date('2022-02-01T07:30:00'),
    //             time_out: new Date('2022-02-01T15:00:00'),
    //         },
    //         {
    //             id: '5',
    //             name: 'Eva',
    //             time_in: new Date('2023-10-15T09:45:00'),
    //             time_out: new Date('2023-10-15T18:15:00'),
    //         },
    //         {
    //             id: '6',
    //             name: 'Frank',
    //             time_in: new Date('2023-11-03T08:00:00'),
    //             time_out: new Date('2023-11-03T17:30:00'),
    //         },
    //         {
    //             id: '7',
    //             name: 'Grace',
    //             time_in: new Date('2023-12-19T08:30:00'),
    //             time_out: new Date('2023-12-19T17:00:00'),
    //         },
    //         {
    //             id: '8',
    //             name: 'Hannah',
    //             time_in: new Date('2023-04-27T09:15:00'),
    //             time_out: new Date('2023-04-27T17:45:00'),
    //         },
    //         {
    //             id: '9',
    //             name: 'Ian',
    //             time_in: new Date('2023-02-14T08:30:00'),
    //             time_out: new Date('2023-02-14T17:00:00'),
    //         },
    //         {
    //             id: '10',
    //             name: 'Jessica',
    //             time_in: new Date('2023-01-30T08:45:00'),
    //             time_out: new Date('2023-01-30T17:15:00'),
    //         },
    //         {
    //             id: '11',
    //             name: 'Kevin',
    //             time_in: new Date('2023-06-18T09:00:00'),
    //             time_out: new Date('2023-06-18T18:30:00'),
    //         },
    //         {
    //             id: '12',
    //             name: 'Lily',
    //             time_in: new Date('2023-08-10T08:15:00'),
    //             time_out: new Date('2023-08-10T16:45:00'),
    //         },
    //         {
    //             id: '13',
    //             name: 'Michael',
    //             time_in: new Date('2023-10-01T07:30:00'),
    //             time_out: new Date('2023-10-01T16:00:00'),
    //         },
    //         {
    //             id: '14',
    //             name: 'Nancy',
    //             time_in: new Date('2023-11-17T09:45:00'),
    //             time_out: new Date('2023-11-17T18:15:00'),
    //         },
    //         {
    //             id: '15',
    //             name: 'Olivia',
    //             time_in: new Date('2023-12-05T08:00:00'),
    //             time_out: new Date('2023-12-05T17:30:00'),
    //         },
    //         {
    //             id: '16',
    //             name: 'Peter',
    //             time_in: new Date('2023-03-22T08:30:00'),
    //             time_out: new Date('2023-03-22T17:00:00'),
    //         },
    //         {
    //             id: '17',
    //             name: 'Quinn',
    //             time_in: new Date('2023-02-07T09:15:00'),
    //             time_out: new Date('2023-02-07T17:45:00'),
    //         },
    //         {
    //             id: '18',
    //             name: 'Rachel',
    //             time_in: new Date('2023-01-18T08:30:00'),
    //             time_out: new Date('2023-01-18T17:00:00'),
    //         },
    //         {
    //             id: '19',
    //             name: 'Simon',
    //             time_in: new Date('2023-07-24T08:45:00'),
    //             time_out: new Date('2023-07-24T17:15:00'),
    //         },
    //         {
    //             id: '20',
    //             name: 'Tina',
    //             time_in: new Date('2023-09-11T09:00:00'),
    //             time_out: new Date('2023-09-11T18:30:00'),
    //         },
    //         {
    //             id: '21',
    //             name: 'Uma',
    //             time_in: new Date('2023-11-28T08:15:00'),
    //             time_out: new Date('2023-11-28T16:45:00'),
    //         },
    //         {
    //             id: '22',
    //             name: 'Victor',
    //             time_in: new Date('2023-12-15T07:30:00'),
    //             time_out: new Date('2023-12-15T16:00:00'),
    //         },
    //         {
    //             id: '23',
    //             name: 'Wendy',
    //             time_in: new Date('2023-06-03T09:45:00'),
    //             time_out: new Date('2023-06-03T18:15:00'),
    //         },
    //         {
    //             id: '24',
    //             name: 'Xavier',
    //             time_in: new Date('2023-08-22T08:00:00'),
    //             time_out: new Date('2023-08-22T17:30:00'),
    //         },
    //         {
    //             id: '25',
    //             name: 'Yara',
    //             time_in: new Date('2023-10-09T08:30:00'),
    //             time_out: new Date('2023-10-09T17:00:00'),
    //         },
    //         {
    //             id: '26',
    //             name: 'Zack',
    //             time_in: new Date('2023-02-26T09:15:00'),
    //             time_out: new Date('2023-02-26T17:45:00'),
    //         },
    //         {
    //             id: '27',
    //             name: 'Adam',
    //             time_in: new Date('2023-04-14T08:30:00'),
    //             time_out: new Date('2023-04-14T17:00:00'),
    //         },
    //         {
    //             id: '28',
    //             name: 'Bella',
    //             time_in: new Date('2023-07-01T08:45:00'),
    //             time_out: new Date('2023-07-01T17:15:00'),
    //         },
    //         {
    //             id: '29',
    //             name: 'Carl',
    //             time_in: new Date('2023-09-19T09:00:00'),
    //             time_out: new Date('2023-09-19T18:30:00'),
    //         },
    //         {
    //             id: '30',
    //             name: 'Diana',
    //             time_in: new Date('2023-11-06T08:15:00'),
    //             time_out: new Date('2023-11-06T16:45:00'),
    //         },
    //     ];
    // }
    getEmployeeAttendanceData(): Observable<any> {
        return this.http.get<any>(`${this.baseUrlAPI}get_all_data_time_in_out`)
    }

    getEmployeeAttendanceMini() {
        return this.getEmployeeAttendanceData().pipe(
            map((data: any[]) => data.slice(0, 5))
        ).toPromise();
    }
    
    getEmployeeAttendance() {
        return Promise.resolve(this.getEmployeeAttendanceData());
    }
}
