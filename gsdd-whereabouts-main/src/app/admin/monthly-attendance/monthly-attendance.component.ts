import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EmployeeAttendance } from 'src/domain/employee-attendance';
import { EmployeeAttendanceService } from 'src/service/employee-attendance.service';
import { Table } from 'primeng/table';
import { FilterMatchMode, PrimeNGConfig } from 'primeng/api';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
    selector: 'app-monthly-attendance',
    templateUrl: './monthly-attendance.component.html',
    styleUrls: ['./monthly-attendance.component.css'],
})
export class MonthlyAttendanceComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    employeeAttendance!: EmployeeAttendance[];

    selectedEmployee!: EmployeeAttendance;

    employeeFirstNames!: any[];

    employeeLastNames!: any[];

    rangeDates!: Date[];

    cols!: any[];

    exportColumns!: any[];

    loading: boolean = true;

    constructor(
        private datePipe: DatePipe,
        private employeeAttendanceService: EmployeeAttendanceService,
        private primengConfig: PrimeNGConfig,
    ) { }

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

       
        
        this.employeeAttendanceService.getEmployeeAttendanceData().subscribe((data) => {
            this.loading = false;
            this.employeeAttendance = data.map((data: any) => {
                if(data.time_in != null){
                    let time_in = new Date(data.time_in);
                    data.time_in = time_in;
                }

                if(data.time_out != null){
                    let time_out = new Date(data.time_out);
                    data.time_out = time_out;
                }
                return data;
            });
        
            this.employeeFirstNames = this.employeeAttendance.map((item) => item.first_name);
            this.employeeLastNames = this.employeeAttendance.map((item) => item.last_name);
        });

        this.cols = [
            { field: 'first_name', header: 'First Name' },
            { field: 'last_name', header: 'Last Name' },
            { field: 'time_in', header: 'Time in' },
            { field: 'time_out', header: 'Time out' },
        ];

        this.exportColumns = this.cols.map((col) => ({
            title: col.header,
            dataKey: col.field,
        }));
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

    exportExcel() {
        const data = this.employeeAttendance.map((item) => {

            // if(item.time_in != null){
            //     let date = new Date(item.time_in);
            //     let isoString = date.toISOString();
            //     item.time_in = `Time In: ${isoString.replace('T', ' ').substring(0, 16)}`;
            // }

            // if(item.time_out != null){
            //     let date = new Date(item.time_out);
            //     let isoString = date.toISOString();
            //     item.time_out = `Time In: ${isoString.replace('T', ' ').substring(0, 16)}`;
            // }
            return item
        });

    
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.dt.el.nativeElement, 
            { dateNF: 'yyyy-mm-dd hh:mm', cellDates: true });

            let columnLetters = Object.keys(ws).reduce((letters, key) => {
                const letterMatch = key.match(/[A-Z]+/);
                if (letterMatch) {
                  letters.add(letterMatch[0]);
                }
                return letters;
              }, new Set());
              
              // Set the width for each column
              ws['!cols'] = Array.from(columnLetters).map(() => ({ wch: 15 }));

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        XLSX.writeFile(wb, 'attendance_export.xlsx');

    }

    convertToManilaTime(isoString: Date) {
        const date = new Date(isoString);
        const timezoneOffset = date.getTimezoneOffset() * 60000; // Convert offset to milliseconds
        const manilaOffset = 8 * 60 * 60000; // Manila offset in milliseconds (UTC+8)
        const manilaTime = new Date(date.getTime() + timezoneOffset + manilaOffset);

        return manilaTime.toISOString();
    }


    //   Old export
    //   exportExcel() {
    //     import('xlsx').then((xlsx) => {
    //       const data = this.employeeAttendance.map((item) => ({
    //         ...item,
    //         time_in: item.time_in.toLocaleString('en-US', {
    //           timeZone: 'Asia/Manila',
    //         }),
    //         time_out: item.time_out.toLocaleString('en-US', {
    //           timeZone: 'Asia/Manila',
    //         }),
    //       }));
    //       const worksheet = xlsx.utils.json_to_sheet(data);
    //       const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    //       const excelBuffer: any = xlsx.write(workbook, {
    //         bookType: 'xlsx',
    //         type: 'array',
    //       });
    //       this.saveAsExcelFile(excelBuffer, 'employee-attendance');
    //     });
    //   }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION,
        );
    }


}
