export interface EmployeeAttendance {
  Id?: string;
  employee_id: string;
  first_name?: string;
  last_name?: string;
  time_in: Date;
  time_out: Date;
  status?: string;
}
