import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeDashboardComponent } from './dashboard/home-dashboard/home-dashboard.component';
import { AccountComponent } from './account/account.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { SetstatusComponent } from './setstatus/setstatus.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TimeinoutComponent } from './timeinout/timeinout.component';
import { TimesheetComponent } from './dashboard/timesheet/timesheet.component';
import { TeamComponent } from './team/team.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AdminComponent } from './admin/admin/admin.component';
import { ReportsHomeComponent } from './admin/reports-home/reports-home.component';
import { MonthlyAttendanceComponent } from './admin/monthly-attendance/monthly-attendance.component';
import { AccountsComponent } from './admin/accounts/accounts.component';
import { NotificationComponent } from './admin/notification/notification.component';
import { RulesComponent } from './admin/rules/rules.component';
import { OrgChartComponent } from './tablet-display/org-chart/org-chart.component';
import { LoginComponent } from './login/login.component';
import { AccountConfirmationComponent } from './admin/account-confirmation/account-confirmation.component';
import { AuthGuard } from './auth.guard';
import { UserRole } from './auth.guard';

const routes: Routes = [
  { component: LoginComponent, path: '' },
  {
    component: HomeDashboardComponent,
    path: 'dashboard',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.User, UserRole.Admin] },
  },
  { component: LoginComponent, path: 'login' },
  {
    component: AccountComponent,
    path: 'account',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.User, UserRole.Admin] },
  },
  {
    component: SetstatusComponent,
    path: 'setstatus',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.User, UserRole.Admin] },
  },
  {
    component: TimesheetComponent,
    path: 'timesheet',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.User, UserRole.Admin] },
  },
  {
    component: TimeinoutComponent,
    path: 'timeinout',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.User, UserRole.Admin] },
  },
  {
    component: TeamComponent,
    path: 'team',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.User, UserRole.Admin] },
  },
  {
    component: NotificationsComponent,
    path: 'notification',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.User, UserRole.Admin] },
  },
  {
    component: AdminComponent,
    path: 'admin_dashboard',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.Admin] },
  },
  {
    component: ReportsHomeComponent,
    path: 'admin_reports-home',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.Admin] },
  },
  {
    component: MonthlyAttendanceComponent,
    path: 'admin_monthly_attendance',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.Admin] },
  },
  {
    component: AccountsComponent,
    path: 'admin_accounts',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.Admin] },
  },
  {
    component: NotificationComponent,
    path: 'admin_notification',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.Admin] },
  },
  {
    component: RulesComponent,
    path: 'admin_rules',
    canActivate: [AuthGuard],
    data: { allowedRoles: [UserRole.Admin] },
  },
  { component: AccountConfirmationComponent, path: 'account_confirmation' },
  {
    component: OrgChartComponent,
    path: 'tablet_display',
  },

  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
