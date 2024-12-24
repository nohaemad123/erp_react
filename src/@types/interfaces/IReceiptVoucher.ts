export interface IReceiptVourcher {
  id?: string;
  code?: string;
  branchId: string;
  branch?: string;
  employeeId?: string;
  employee?: string;
  amount?: number;
  date?: Date;
  note?: string;
  fromAccountId?: string;
  toAccountId?: string;
  fromAccount?: string;
  toAccount?: string;
  dateTo?: Date;
  dateFrom?: Date;
}
