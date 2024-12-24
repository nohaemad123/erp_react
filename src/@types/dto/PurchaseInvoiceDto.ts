// import { IProductUnit } from "@/@types/interfaces/IProduct";
import { customId } from "@/@types/stables";

export interface IPurchaseInvoiceDto {
  id?: string;
  branchId: string;
  code?: number;
  date: Date;
  storeId: string;
  store?: string;
  vendorId: string;
  vendor?: string;
  qty?: number;
  subTotal?: number;
  netTotal?: number;
  supplierInvoiceNumber: number | null;
  purchaseOrderNumber: number | null;
  notes: string;
  invoiceType: number | null;
  discountType: number;
  discountValue: number;
  details: PurchaseInvoiceDetailsRow[];
}

export interface IPurchaseInvoiceTaxDto {
  taxType?: string;
  taxTypeId: any;
  purchaseInvoiceDetailsId?: string;
  taxRate?: number;
}

export class PurchaseInvoiceDto implements Partial<IPurchaseInvoiceDto> {
  code: number;
  id?: string;
  date: Date;
  storeId: string;
  vendorId: string;
  supplierInvoiceNumber: number | null;
  purchaseOrderNumber: number | null;
  note: string;
  invoiceType: number | null;
  discountType: number;
  discountValue: number;
  details: PurchaseInvoiceDetailsRow[];
  constructor({
    id,
    code = 0,
    date = new Date(),
    storeId = "",
    vendorId = "",
    note = "",
    supplierInvoiceNumber = null,
    purchaseOrderNumber = null,
    invoiceType = null,
    discountType = 1,
    discountValue = 0,
    details = [],
  }: Partial<PurchaseInvoiceDto> = {}) {
    this.id = id;
    this.code = code;
    this.date = date;
    this.storeId = storeId;
    this.vendorId = vendorId;
    this.supplierInvoiceNumber = supplierInvoiceNumber;
    this.purchaseOrderNumber = purchaseOrderNumber;
    this.note = note;
    this.invoiceType = invoiceType;
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.details = details;
  }
}

export class PurchaseInvoiceDetailsRow implements Partial<IPurchaseInvoice> {
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
  }: Partial<PurchaseInvoiceDetailsRow> = {}) {
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

interface IPurchaseInvoice {
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
