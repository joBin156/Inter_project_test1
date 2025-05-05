import { Component, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TimeInOutService } from 'src/service/time-in-out.service';
import { Table } from 'primeng/table';
import { Message, MessageService } from 'primeng/api';
import { TimeInAndOutData } from 'src/domain/timesheet';
@Component({
    selector: 'app-timesheet',
    templateUrl: './timesheet.component.html',
    styleUrls: ['./timesheet.component.css'],
    standalone: false
})
export class TimesheetComponent {
    @ViewChild('dttimesheet') dt!: Table;
    constructor(private timeInOutService: TimeInOutService, private messageService: MessageService) { }

    date: Date = new Date();

    user_Id = localStorage.getItem('id');

    timeInAndOutData: TimeInAndOutData[] = [];

    selectedtimeInAndOutData: any;

    clonedselectedtimeInAndOutData: any;

    cols!: any[];

    loading: boolean = true;

    ngOnInit() {

        this.cols = [
            { field: 'time_in', header: 'Time in' },
            { field: 'time_out', header: 'Time out' },
        ];


        this.getTimeInAndOut();
    }
    getTimeInAndOut() {
        this.timeInOutService.getTimeInAndOut(this.user_Id).subscribe((res) => {
            this.loading = false;
            res = res.map((item: any) => {
                let formattedItem = { ...item };

                if(formattedItem.time_in != null){
                    let date = new Date(formattedItem.time_in);
                    let hours = date.getHours().toString();
                    let minutes = date.getMinutes().toString();

                    hours = hours.length < 2 ? '0' + hours : hours;
                    minutes = minutes.length < 2 ? '0' + minutes : minutes;
                
                    formattedItem.time_in_time_only = `${hours}:${minutes}`;
                }

                if(formattedItem.time_out != null){
                    let date = new Date(formattedItem.time_out);
                    let hours = date.getHours().toString();
                    let minutes = date.getMinutes().toString();

                    hours = hours.length < 2 ? '0' + hours : hours;
                    minutes = minutes.length < 2 ? '0' + minutes : minutes;
                
                    formattedItem.time_out_time_only = `${hours}:${minutes}`;
                }

                if(formattedItem.time_in != null){
                    let date = new Date(formattedItem.time_in);
                    let year = date.getFullYear().toString();
                    let month = (date.getMonth() + 1).toString();
                    let day = date.getDate().toString();
                
                    month = month.length < 2 ? '0' + month : month;
                    day = day.length < 2 ? '0' + day : day;
                    formattedItem.time_in_date_only = `${year}-${month}-${day}`;
                }

                if(formattedItem.time_out != null){
                    let date = new Date(formattedItem.time_out);
                    let year = date.getFullYear().toString();
                    let month = (date.getMonth() + 1).toString(); // Months are 0-based in JavaScript
                    let day = date.getDate().toString();
                
                    month = month.length < 2 ? '0' + month : month;
                    day = day.length < 2 ? '0' + day : day;
                    formattedItem.time_out_date_only = `${year}-${month}-${day}`;
                }

                return formattedItem;
            });

            this.timeInAndOutData = res

        })
    }

    onRowEditInit(timeInOut: any) {
        this.clonedselectedtimeInAndOutData[timeInOut.Id] = {... timeInOut };

    }
    
    onRowEditSave(timeInOut: any) {
        if(timeInOut.time_in === '' ||
            timeInOut.time_out === ''
        ){
            this.messageService.add({
                severity: 'error',
                summary: 'error',
                detail: 'Invalid fields',
              }); 
        }
        const Id = timeInOut.Id;
        const TimeIn = `${timeInOut.time_in_date_only} ${timeInOut.time_in_time_only}`;
        const TimeOut = `${timeInOut.time_out_date_only} ${timeInOut.time_out_time_only}`;

        try{
            
        this.timeInOutService.updateData(Id, new Date(TimeIn), new Date(TimeOut)).subscribe((res)=>{
            this.messageService.add({ severity: 'info', summary: '', detail: "Updated successfuly" });
        })
        }catch(err){
            this.messageService.add({ severity: 'error', summary: '', detail: "Error Occured: " + err });
        }

        // timeInAndOutData
    }

    onRowEditCancel() {
    }

    applyFilterGlobal($event: any, stringVal: any) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    clear(table: Table) {
        table.clear();
    }

}
