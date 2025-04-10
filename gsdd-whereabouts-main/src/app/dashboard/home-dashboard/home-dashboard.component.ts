import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabService } from 'src/service/tab.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css'],
})
export class HomeDashboardComponent implements OnInit, OnDestroy {
  constructor(private tabService: TabService) {}
  public activeTabIndex = 0;
  private tabSubscription?: Subscription;

  ngOnInit() {
    this.tabSubscription = this.tabService.currentIndex.subscribe(
      (index) => (this.activeTabIndex = index),
    );
  }

  ngOnDestroy() {
    if (this.tabSubscription) {
      this.tabSubscription.unsubscribe();
    }
  }

  goToTimeSheet() {
    this.tabService.changeTab(1);
  }
}
