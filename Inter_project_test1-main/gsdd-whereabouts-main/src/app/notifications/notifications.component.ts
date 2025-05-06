import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Notification } from 'src/domain/notification';
import { MessageService } from 'primeng/api';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css'],
    standalone: false
})
export class NotificationsComponent implements OnInit {

    constructor(private messageService: MessageService) { }

    private baseUrlAPI = `${environment.WSSUrl}`;

    socket = new WebSocket(`ws://${this.baseUrlAPI}`);

    ngOnInit(): void {
        this.socket.addEventListener('message', (event) => {
            if (!event.data) {

            }
            let statusNotification;
            try {
                statusNotification = JSON.parse(event.data);
                let message = `${statusNotification.first_name} ${statusNotification.last_name} set status to ${statusNotification.setStatus.status}`
                this.messageService.add({ severity: 'info', summary: '', detail: message });

            } catch (err) {
                return;
            }

        })
    }

    clearNotification() {
        this.messageService.clear();
    }
}
