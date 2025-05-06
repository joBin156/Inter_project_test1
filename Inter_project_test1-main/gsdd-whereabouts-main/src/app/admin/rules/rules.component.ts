import { Component, OnInit } from '@angular/core';
import { Time } from 'src/domain/admin-rules';

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.css'],
    standalone: false
})
export class RulesComponent implements OnInit {
  timeRule!: Time[];

  selectedTimeRule!: Time[];

  pauseTracking = [
    { label: 'True', value: true },
    { label: 'False', value: false },
  ];

  selectedPauseTracking!: { label: string; value: boolean };

  ngOnInit() {
    this.timeRule = [
      { time: '7:00 AM-6:00 PM' },
      { time: '8:00 AM-5:00 PM' },
      { time: '9:00 AM-6:00 PM' },
    ];
  }
}
