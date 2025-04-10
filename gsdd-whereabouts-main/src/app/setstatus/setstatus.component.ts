import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { StatusService } from 'src/service/status.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-setstatus',
  templateUrl: './setstatus.component.html',
  styleUrls: ['./setstatus.component.css'],
})
export class SetstatusComponent implements OnInit {
    private baseUrlAPI = `${environment.WSSUrl}`;

    constructor(private statusService: StatusService, private messageService: MessageService){}

    date: any;
    time: any;

    statusForm = new FormGroup({
        status: new FormControl({ label: '', value: '' }, Validators.required),
    })

    status!: SelectItem[];

    ngOnInit(): void {
        this.statusService.getStatusValue().subscribe((req)=>{
            this.status = req;
        }, (err)=>{console.log(err);})
        // this.status = [
        //     {label: 'Sick Leave', value: 'Sick Leave'},
        //     {label: 'Mandatory Leave', value: 'Mandatory Leave'},
        //     {label: 'Vacation Leave', value: 'Vacation Leave'},
        //     {label: 'Do not disturb', value: 'Do not disturb'},
        //     {label: 'Sick Leave', value: 'Sick Leave'},
        //     {label: 'In a meeting', value: 'In a meeting'},
        //     {label: 'Table', value: '123'},
        // ]
    }

    onSetStatusSubmit(){
        // this.statusService.setStatus()
        const id: string | null = localStorage.getItem("id");
        const status: any = this.statusForm.value.status?.value
        if(!id){
            console.error(" Error occured. Please sign out and log-in again.");
        }

        if(!status){
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select your status.' });
        }
        try{
            this.statusService.setStatus(id, status).subscribe((res)=>{
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Status update success!' });

            });
        }catch(err){
            console.error(err)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Status update failed! ' + err });

        }
    }
}
