export interface IPaymentDto {
  employeeId: string;
  code: string;
  amount: number;
  note: string | null;
  toAccountId: string;
  id?: string;
  fromAccountId: string;
  branchId: string;
  date: Date | null;
}

export class PaymentDto implements Partial<IPaymentDto> {
  employeeId: string;
  code: string;
  toAccountId: string;
  id?: string;
  fromAccountId: string;
  note: string | null;
  amount: number;
  branchId?: string;
  date: Date | null;
  constructor({
    id,
    fromAccountId = "",
    note = "",
    amount = 0,
    code = "",
    employeeId = "",
    toAccountId = "",
    branchId = "",
    date = new Date(),
  }: Partial<PaymentDto> = {}) {
    this.amount = amount;
    this.date = date;
    this.toAccountId = toAccountId;
    this.note = note;
    this.fromAccountId = fromAccountId;
    this.code = code;
    this.employeeId = employeeId;
    this.branchId = branchId;
    this.id = id;
  }
}
