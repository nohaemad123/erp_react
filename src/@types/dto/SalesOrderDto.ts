// import { IProductUnit } from "@/@types/interfaces/IProduct";
import { customId } from "@/@types/stables";

export interface ISalesOrderDto {
  branchId: string;
  code?: number;
  date: Date;
  storeId: string;
  customerId: string;
  notes: string;
  discountType: number;
  discountValue: number;
  details: any[];
  // details: PurchaseOrderDetailsRow[];
}

export interface ISalesOrderTaxDto {
  taxType?: string;
  taxTypeId: any;
  purchaseInvoiceDetailsId?: string;
  taxRate?: number;
}

export class SalesOrderDto implements Partial<ISalesOrderDto> {
  code: number;
  id?: string;
  date: Date;
  storeId: string;
  customerId: string;
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
    note = "",
    discountType = 1,
    discountValue = 0,
    details = [],
  }: Partial<SalesOrderDto> = {}) {
    this.id = id;
    this.code = code;
    this.date = date;
    this.storeId = storeId;
    this.customerId = customerId;
    this.note = note;
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.details = details;
  }
}

export class SalesOrderDetailsRow implements Partial<ISalesOrder> {
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
  taxDetails: ISalesOrderTaxDto[];

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
  }: Partial<SalesOrderDetailsRow> = {}) {
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

interface ISalesOrder {
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
