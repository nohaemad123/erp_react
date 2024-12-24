import { ProductUnitRow } from "@/@types/dto/ProductDto";
import { InvoiceStatusEnum, SalesTypeEnum } from "@/@types/interfaces/IInvoice";
import { customId } from "@/@types/stables";

export interface IInvoiceDto {
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
  invoiceStatusId: InvoiceStatusEnum | null;
  salesTypeId: SalesTypeEnum | null;
  invoiceStatus: string | null;
  salesType: string | null;
  discountValue: number;
  remainingAmount: number;
  customerId: string | null;
  salesManId: string | null;
  details: InvoiceProductRow[];
}

export class InvoiceDto implements Partial<IInvoiceDto> {
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
  invoiceStatusId: InvoiceStatusEnum | null;
  salesTypeId: SalesTypeEnum | null;
  invoiceStatus: string | null;
  salesType: string | null;
  discountValue: number;
  remainingAmount: number;
  customerId: string | null;
  salesManId: string | null;
  details: InvoiceProductRow[];
  constructor({
    id = null,
    note = "",
    code = null,
    date = new Date(),
    branchId = null,
    documentNumber = 0,
    storeId = null,
    safeId = null,
    invoiceType = 1,
    discountType = 0,
    invoiceStatusId = InvoiceStatusEnum.Done,
    salesTypeId = SalesTypeEnum.Cashier,
    invoiceStatus = null,
    salesType = null,
    discountValue = 0,
    remainingAmount = 0,
    customerId = null,
    salesManId = null,
    details = [],
  }: Partial<InvoiceDto> = {}) {
    this.id = id;
    this.note = note;
    this.code = code;
    this.date = date;
    this.branchId = branchId;
    this.documentNumber = documentNumber;
    this.storeId = storeId;
    this.safeId = safeId;
    this.invoiceType = invoiceType;
    this.discountType = discountType;
    this.invoiceStatusId = invoiceStatusId;
    this.salesTypeId = salesTypeId;
    this.invoiceStatus = invoiceStatus;
    this.salesType = salesType;
    this.discountValue = discountValue;
    this.remainingAmount = remainingAmount;
    this.customerId = customerId;
    this.salesManId = salesManId;
    this.details = details;
  }
}

export interface IInvoiceProductRow {
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
  taxDetails: InvoiceTaxRow[];
  productUnits: ProductUnitRow[];
}

export class InvoiceProductRow implements Partial<IInvoiceProductRow> {
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
  taxDetails: InvoiceTaxRow[];
  productUnits: ProductUnitRow[];
  constructor({
    rowId = customId(),
    productUnitId = "",
    qty = 0,
    price = 0,
    cost = 0,
    totalTax = 0,
    total = 0,
    discountValue = 0,
    discountType = 0,
    productId = "",
    barcode = "",
    productName = "",
    taxDetails = [],
    productUnits = [],
  }: Partial<IInvoiceProductRow> = {}) {
    this.rowId = rowId;
    this.productUnitId = productUnitId;
    this.qty = qty;
    this.price = price;
    this.cost = cost;
    this.totalTax = totalTax;
    this.total = total;
    this.discountValue = discountValue;
    this.discountType = discountType;
    this.productId = productId;
    this.barcode = barcode;
    this.productName = productName;
    this.taxDetails = taxDetails;
    this.productUnits = productUnits;
  }
}

export interface IInvoiceTaxRow {
  rowId: string;
  taxType: string;
  taxTypeId: string | null;
  salesInvoiceDetailsId: string | null;
  taxRate: number;
}

export class InvoiceTaxRow implements Partial<IInvoiceTaxRow> {
  rowId: string;
  taxType: string;
  taxTypeId: string | null;
  salesInvoiceDetailsId: string | null;
  taxRate: number;
  constructor({
    rowId = customId(),
    taxType = "",
    taxTypeId = null,
    salesInvoiceDetailsId = null,
    taxRate = 0,
  }: Partial<IInvoiceTaxRow> = {}) {
    this.rowId = rowId;
    this.taxType = taxType;
    this.taxTypeId = taxTypeId;
    this.salesInvoiceDetailsId = salesInvoiceDetailsId;
    this.taxRate = taxRate;
  }
}
