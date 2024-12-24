// import { IProductUnit } from "@/@types/interfaces/IProduct";
import { customId } from "@/@types/stables";

export interface ISalesInvoiceDto {
  id?: string;
  branchId: string;
  code?: number;
  date: Date;
  storeId: string;
  customerId: string;
  customerName?: string;
  storeName?: string;
  salesManId: string;
  documentNumber: number;
  qty?: number;
  notes: string;
  discountType: number;
  discountValue: number;
  details: SalesInvoiceDetailsRow[];
}

export interface ISalesInvoiceTaxDto {
  taxType?: string;
  taxTypeId: any;
  purchaseInvoiceDetailsId?: string;
  taxRate?: number;
}

export class SalesInvoiceDto implements Partial<ISalesInvoiceDto> {
  code: number;
  id?: string;
  date: Date;
  storeId: string;
  customerId: string;
  salesManId: string;
  documentNumber: number;
  invoiceType: number | null;
  note: string;
  discountType: number;
  discountValue: number;
  details: SalesInvoiceDetailsRow[];
  constructor({
    id,
    code = 0,
    date = new Date(),
    storeId = "",
    customerId = "",
    salesManId = "",
    documentNumber = 0,
    invoiceType = null,
    note = "",
    discountType = 1,
    discountValue = 0,
    details = [],
  }: Partial<SalesInvoiceDto> = {}) {
    this.id = id;
    this.code = code;
    this.date = date;
    this.storeId = storeId;
    this.customerId = customerId;
    this.salesManId = salesManId;
    this.invoiceType = invoiceType;
    this.documentNumber = documentNumber;
    this.note = note;
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.details = details;
  }
}

export class SalesInvoiceDetailsRow implements Partial<ISalesInvoice> {
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
  taxDetails: any[];
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
  }: Partial<SalesInvoiceDetailsRow> = {}) {
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

interface ISalesInvoice {
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
