import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'gsdd-whereabouts';

  ngOnInit(): void {
    initFlowbite();
  }
}
