import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { EmployeeAttendanceService } from 'src/service/employee-attendance.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { EmployeeStatusService } from 'src/service/employee-status.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/service/employee-account.service';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ToastItem } from 'primeng/toast';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';
// Components
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RegisterComponent } from './register/register.component';
import { HomeDashboardComponent } from './dashboard/home-dashboard/home-dashboard.component';
import { TimesheetComponent } from './dashboard/timesheet/timesheet.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ChangepinComponent } from './dashboard/changepin/changepin.component';
import { AccountComponent } from './account/account.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { SetstatusComponent } from './setstatus/setstatus.component';
import { TimeinoutComponent } from './timeinout/timeinout.component';
import { TeamComponent } from './team/team.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AdminComponent } from './admin/admin/admin.component';
import { ReportsHomeComponent } from './admin/reports-home/reports-home.component';
import { MonthlyAttendanceComponent } from './admin/monthly-attendance/monthly-attendance.component';
import { TeamMemberStatusComponent } from './admin/team-member-status/team-member-status.component';
import { AccountsComponent } from './admin/accounts/accounts.component';
import { NotificationComponent } from './admin/notification/notification.component';
import { RulesComponent } from './admin/rules/rules.component';
import { OrgChartComponent } from './tablet-display/org-chart/org-chart.component';
import { AccountConfirmationComponent } from './admin/account-confirmation/account-confirmation.component';
import { UserButtonComponent } from './tablet-display/user-button/user-button.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    RegisterComponent,
    HomeDashboardComponent,
    TimesheetComponent,
    DashboardComponent,
    ChangepinComponent,
    AccountComponent,
    NotfoundComponent,
    SetstatusComponent,
    TimeinoutComponent,
    TeamComponent,
    NotificationsComponent,
    AdminComponent,
    ReportsHomeComponent,
    MonthlyAttendanceComponent,
    TeamMemberStatusComponent,
    AccountsComponent,
    NotificationComponent,
    RulesComponent,
    OrgChartComponent,
    AccountConfirmationComponent,
    UserButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ChartModule,
    FormsModule,
    CalendarModule,
    TabViewModule,
    TableModule,
    MultiSelectModule,
    ButtonModule,
    ToastModule,
    DropdownModule,
    ToolbarModule,
    ConfirmDialogModule,
    DialogModule,
    HttpClientModule,
    ReactiveFormsModule,
    KeyFilterModule,
    PasswordModule,
    MessagesModule
  ],
  providers: [
    DatePipe,
    EmployeeAttendanceService,
    EmployeeStatusService,
    MessageService,
    AccountService,
    ConfirmationService,
    ToastItem,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
