import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EmployeeStatus } from 'src/domain/employee-status';
import { EmployeeStatusService } from 'src/service/employee-status.service';
import { Table } from 'primeng/table';
import { FilterMatchMode, PrimeNGConfig } from 'primeng/api';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-team-member-status',
  templateUrl: './team-member-status.component.html',
  styleUrls: ['./team-member-status.component.css'],
})
export class TeamMemberStatusComponent implements OnInit {
  @ViewChild('dtstatus') dt!: Table;

  employeeStatus!: EmployeeStatus[];

  selectedEmployee!: EmployeeStatus;

  employeeStatusNames!: any[];

  employeeStatusList!: any[];

  flattenedEmployeeStatus!: any[];

  rangeDates!: Date[];

  loading: boolean = true;

  constructor(
    private datePipe: DatePipe,
    private employeeStatusService: EmployeeStatusService,
    private primengConfig: PrimeNGConfig,
  ) {}

  ngOnInit() {
    this.primengConfig.filterMatchModeOptions = {
      text: [
        FilterMatchMode.STARTS_WITH,
        FilterMatchMode.CONTAINS,
        FilterMatchMode.NOT_CONTAINS,
        FilterMatchMode.ENDS_WITH,
        FilterMatchMode.EQUALS,
        FilterMatchMode.NOT_EQUALS,
      ],
      numeric: [
        FilterMatchMode.EQUALS,
        FilterMatchMode.NOT_EQUALS,
        FilterMatchMode.LESS_THAN,
        FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
        FilterMatchMode.GREATER_THAN,
        FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
      ],
      date: [
        FilterMatchMode.DATE_IS,
        FilterMatchMode.DATE_IS_NOT,
        FilterMatchMode.DATE_BEFORE,
        FilterMatchMode.DATE_AFTER,
      ],
    };

    this.employeeStatusService.getEmployeeStatus().then((data) => {
      this.loading = false;
      this.employeeStatus = data.map((item) => ({
        status_from_to: item.status_from_to.map((statusItem) => ({
          ...statusItem,
          from: new Date(statusItem.from),
          to: new Date(statusItem.to),
        })),
      }));

    //   TEMPORARY REMOVE
    //   this.employeeStatusNames = Array.from(
    //     new Set(this.employeeStatus.map((item) => item.name)),
    //   );

      this.employeeStatusList = [
        ...new Set(
          this.employeeStatus.flatMap((item) =>
            item.status_from_to
              ? item.status_from_to.map((status) => status.status)
              : [],
          ),
        ),
      ];

      this.flattenedEmployeeStatus = this.employeeStatus.flatMap((item) =>
        item.status_from_to
          ? item.status_from_to.map((status) => ({
              ...item,
              status: status.status,
              from: status.from,
              to: status.to,
            }))
          : [],
      );
    });
  }

  date() {
    let jsonDateRange = {
      startDate: this.datePipe.transform(this.rangeDates[0], 'MM/dd/yy'),
      endDate: this.datePipe.transform(this.rangeDates[1], 'MM/dd/yyyy'),
    };
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  clear(table: Table) {
    table.clear();
  }
}
