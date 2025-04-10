import { Injectable } from '@angular/core';

@Injectable()
export class EmployeeStatusService {
  getEmployeeStatusData() {
    return [
      {
        id: '1',
        name: 'Dummy data',
        status_from_to: [
          {
            status: 'Dummy data',
            from: new Date('2022-01-01T09:30:00'),
            to: new Date('2022-01-01T17:00:00'),
          },
          {
            status: 'Dummy data1',
            from: new Date('2022-02-01T09:32:00'),
            to: new Date('2022-02-01T18:00:00'),
          },
          {
            status: 'Dummy data2',
            from: new Date('2022-03-01T08:00:00'),
            to: new Date('2022-03-01T16:00:00'),
          },
        ],
      },
    ];
  }

  getEmployeeStatusMini() {
    return Promise.resolve(this.getEmployeeStatusData().slice(0, 5));
  }

  getEmployeeStatus() {
    return Promise.resolve(this.getEmployeeStatusData());
  }
}
