import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    standalone: false
})
export class SidebarComponent {
  constructor(private router: Router) {}

  role = localStorage.getItem('role');

  signOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
