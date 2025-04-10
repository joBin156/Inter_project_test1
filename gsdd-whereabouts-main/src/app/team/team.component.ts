import { Component } from '@angular/core';
import { EmployeeStatus } from 'src/domain/employee-status';
import { environment } from 'src/environments/environment';
import { StatusService } from 'src/service/status.service';
@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css'],
})
export class TeamComponent {
    currentDate = new Date();

    constructor(private statusService: StatusService) { }

    private baseUrlAPI = `${environment.WSSUrl}`;

    socket = new WebSocket(`ws://${this.baseUrlAPI}`);


    statusData: any = [];

    employeeStatuses: EmployeeStatus[] = [];

    ngOnInit(): void {

        this.getAllLatestStatus();
        this.listenForNewMessages();

    }

    getAllLatestStatus() {
        this.statusService.getAllLatestStatus().subscribe((res) => {
            this.employeeStatuses.push(...res);
        });
    }

    listenForNewMessages() {
        this.socket.addEventListener('message', (event) => {
            if (!event.data) {

            }

            let newStatus;

            try {
                newStatus = JSON.parse(event.data);
            } catch (err) {
                return;
            }

            const employeeStatus: EmployeeStatus = {
                first_name: newStatus.first_name,
                last_name: newStatus.last_name,
                status: newStatus.setStatus.status
            }

            const index = this.employeeStatuses.findIndex(emp => emp.first_name === employeeStatus.first_name
                && emp.last_name === employeeStatus.last_name);

            if(index !== -1){
                this.employeeStatuses[index].status = employeeStatus.status;
            }else{
                this.employeeStatuses.push(employeeStatus);
            }

        })
    }

    getStatus(first_name: string, last_name: string) {
        const employees = this.employeeStatuses.filter(e => e.first_name === first_name && e.last_name === last_name);

        return employees.length > 0 ? employees[employees.length - 1].status : null;
    }


}
