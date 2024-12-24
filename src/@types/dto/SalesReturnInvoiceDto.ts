// import { IProductUnit } from "@/@types/interfaces/IProduct";
import { customId } from "@/@types/stables";

export interface ISalesReturnInvoiceDto {
  id?: string;
  branchId: string;
  code?: number;
  date: Date;
  storeId: string;
  customerId: string;
  salesManId: string;
  salesInvoiceHeadId: string;
  customer?: string;
  qty?: number;
  store?: string;
  invoiceNumber: number;
  invoiceType: number;
  note: string;
  discountType: number;
  discountValue: number;
  netTotal?: number;
  details: SalesReturnInvoiceDetailsRow[];
}

export interface ISalesReturnInvoiceTaxDto {
  taxType?: string;
  taxTypeId: any;
  purchaseInvoiceDetailsId?: string;
  taxRate?: number;
}

export class SalesReturnInvoiceDto implements Partial<ISalesReturnInvoiceDto> {
  code: number;
  id?: string;
  date: Date;
  storeId: string;
  customerId: string;
  salesManId: string;
  salesInvoiceHeadId: string;
  invoiceNumber: number;
  invoiceType: number;
  note: string;
  discountType: number;
  discountValue: number;
  details: any[];
  constructor({
    id,
    code = 0,
    date = new Date(),
    storeId = "",
    customerId = "",
    salesManId = "",
    salesInvoiceHeadId = "",
    invoiceNumber = 0,
    invoiceType = 0,
    note = "",
    discountType = 1,
    discountValue = 0,
    details = [],
  }: Partial<SalesReturnInvoiceDto> = {}) {
    this.id = id;
    this.code = code;
    this.date = date;
    this.storeId = storeId;
    this.customerId = customerId;
    this.salesManId = salesManId;
    this.invoiceType = invoiceType;
    this.salesInvoiceHeadId = salesInvoiceHeadId;
    this.invoiceNumber = invoiceNumber;
    this.note = note;
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.details = details;
  }
}

export class SalesReturnInvoiceDetailsRow implements Partial<ISalesReturnInvoice> {
  id: string;
  rowId: string;
  productUnitId: string;
  qty: number;
  price: number;
  cost: number;
  taxValue: number;
  taxId: string;
  productName: string;
  productId: string;
  barcode: string;
  productUnits: any[];
  taxDetails: ISalesReturnInvoiceTaxDto[];
  totalTax?: number;

  constructor({
    id = "",
    rowId = customId(),
    productUnitId = "",
    qty = 1,
    price = 0,
    cost = 0,
    taxValue = 0,
    taxId = "",
    productName = "",
    productId = "",
    barcode = "",
    productUnits = [],
    taxDetails = [],
  }: Partial<SalesReturnInvoiceDetailsRow> = {}) {
    this.id = id;
    this.rowId = rowId;
    this.barcode = barcode;
    this.productUnitId = productUnitId;
    this.taxId = taxId;
    this.qty = qty;
    this.price = price;
    this.cost = cost;
    this.taxValue = taxValue;
    this.productName = productName;
    this.productId = productId;
    this.barcode = barcode;
    this.productUnits = productUnits;
    this.taxDetails = taxDetails;
  }
}

interface ISalesReturnInvoice {
  id: string;
  rowId: string;
  barcode: string;
  productId: string;
  productUnitId: string;
  qty: number;
  price: number;
  cost: number;
  total: number;
  taxDetails: any[];
  taxTotal: number;
}
