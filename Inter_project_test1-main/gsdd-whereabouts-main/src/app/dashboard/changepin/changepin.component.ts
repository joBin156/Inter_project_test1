import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/service/employee-account.service';

@Component({
    selector: 'app-changepin',
    templateUrl: './changepin.component.html',
    styleUrls: ['./changepin.component.css'],
    standalone: false
})
export class ChangepinComponent {
    newPinControl = new FormControl('');
    confirmPinControl = new FormControl('');

    constructor(private messageService: MessageService, private accountService: AccountService){}

    changePin(){
        const newPin = this.newPinControl.value;
        const confirmNewPin = this.confirmPinControl.value;
        
        if( newPin !== confirmNewPin){
            return this.messageService.add({severity: 'warn', summary: '', detail:"Pin do not match"});
        }

        if( newPin?.length != 6 || confirmNewPin?.length != 6){
            return this.messageService.add({severity: 'warn', summary: '', detail:"Pin must be 6-digits"});

        }

        if(!newPin || !confirmNewPin){
            return this.messageService.add({severity: 'error', summary: 'Error', detail:"Invalid fields"});
        }

        const Id = localStorage.getItem('id');

        this.accountService.changePin(Id, confirmNewPin).subscribe((res)=>{
        })
        this.newPinControl.reset();
        this.confirmPinControl.reset();
        return this.messageService.add({severity: 'success', summary: '', detail:"Changed pin successfully!"});



    }
}