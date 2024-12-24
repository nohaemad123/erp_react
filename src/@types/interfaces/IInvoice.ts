import { IProductUnit } from "@/@types/interfaces/IProduct";

export enum InvoiceStatusEnum {
  Done = 0,
  Hold = 1,
}
export enum SalesTypeEnum {
  SalesInvoice = 0,
  Cashier = 1,
}

export interface IInvoiceTax {
  rowId: string;
  taxType: string;
  taxTypeId: string;
  salesInvoiceDetailsId: string;
  taxRate: number;
}

export interface IInvoiceProduct {
  rowId: string;
  productUnitId: string;
  qty: number;
  price: number;
  cost: number;
  totalTax: number;
  total: number;
  discountValue: number;
  discountType: number;
  productId: string;
  barcode: string;
  productName: string;
  taxDetails: IInvoiceTax[];
  productUnits: IProductUnit[];
}

export interface IInvoice {
  id: string | null;
  note: string;
  code: number | null;
  date: Date;
  branchId: string | null;
  documentNumber: number;
  storeId: string | null;
  safeId: string | null;
  invoiceType: number;
  discountType: number;
  invoiceStatusId: InvoiceStatusEnum;
  salesTypeId: SalesTypeEnum;
  invoiceStatus: string | null;
  salesType: string | null;
  discountValue: number;
  remainingAmount: number;
  customerId: string | null;
  salesManId: string | null;
  details: IInvoiceProduct[];
}
