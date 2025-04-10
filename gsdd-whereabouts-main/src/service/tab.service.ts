import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private indexSource = new BehaviorSubject<number>(0);
  currentIndex = this.indexSource.asObservable();

  changeTab(index: number) {
    this.indexSource.next(index);
  }
}
