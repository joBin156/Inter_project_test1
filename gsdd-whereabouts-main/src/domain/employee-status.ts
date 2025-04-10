export interface EmployeeStatus {
  id?: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  status_from_to?: {
    status?: string;
    from?: Date;
    to?: Date;
  }[];
  statusList?: string;
}
