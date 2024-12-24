// import { IProductUnit } from "@/@types/interfaces/IProduct";
import { customId } from "@/@types/stables";

export interface IPurchaseOrderDto {
  branchId: string;
  code?: number;
  date: Date;
  storeId: string;
  vendorId: string;
  notes: string;
  invoiceType: number;
  discountType: number;
  discountValue: number;
  details: any[];
  // details: PurchaseOrderDetailsRow[];
}

export interface IPurchaseOrderTaxDto {
  taxType?: string;
  taxTypeId: any;
  purchaseInvoiceDetailsId?: string;
  taxRate?: number;
}

export class PurchaseOrderDto implements Partial<IPurchaseOrderDto> {
  code: number;
  id?: string;
  date: Date;
  storeId: string;
  vendorId: string;
  note: string;
  invoiceType: number;
  discountType: number;
  discountValue: number;
  details: any[];
  constructor({
    id,
    code = 0,
    date = new Date(),
    storeId = "",
    vendorId = "",
    note = "",
    invoiceType = 0,
    discountType = 1,
    discountValue = 0,
    details = [],
  }: Partial<PurchaseOrderDto> = {}) {
    this.id = id;
    this.code = code;
    this.date = date;
    this.storeId = storeId;
    this.vendorId = vendorId;
    this.note = note;
    this.invoiceType = invoiceType;
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.details = details;
  }
}

export class PurchaseOrderDetailsRow implements Partial<IPurchaseOrder> {
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
  }: Partial<PurchaseOrderDetailsRow> = {}) {
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

interface IPurchaseOrder {
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
