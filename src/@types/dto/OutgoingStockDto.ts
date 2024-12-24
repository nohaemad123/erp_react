import { IOutgoingStoreDetails, IProductUnits } from "@/@types/interfaces/IOutgoingStoreTransactions";
import { customId } from "@/@types/stables";

export interface IOutgoingStockDto {
  code: number;
  id?: string;
  note: string;
  accountId: string;
  outgoingStoreType: string;
  date: Date;
  branchId: string;
  storeId: string;
  details: IOutgoingStoreDetails[];
}

export class OutgoingStockDto implements Partial<IOutgoingStockDto> {
  code: number;
  id?: string;
  note: string;
  outgoingStoreType: string;
  accountId: string;
  date: Date;
  branchId: string;
  storeId: string;
  details: IOutgoingStoreDetails[];
  constructor({
    id,
    code = 0,
    note = "",
    outgoingStoreType = "",
    accountId = "",
    date = new Date(),
    branchId = "",
    storeId = "",
    details = [],
  }: Partial<OutgoingStockDto> = {}) {
    this.code = code;
    this.id = id;
    this.note = note;
    this.outgoingStoreType = outgoingStoreType;
    this.accountId = accountId;
    this.date = date;
    this.branchId = branchId;
    this.storeId = storeId;
    this.details = details;
  }
}

export class OutgoingStockRow implements Partial<IOutgoingStoreDetails> {
  id: string;
  rowId: string;
  productUnitId: string;
  qty: number | null;
  price: number | null;
  cost: number | null;
  productName: string;
  productId: string;
  barcode: string;
  productUnits: IProductUnits[];

  constructor({
    id = "",
    rowId = customId(),
    productUnitId = "",
    qty = null,
    price = null,
    cost = null,
    productName = "",
    productId = "",
    barcode = "",
    productUnits = [],
  }: Partial<IOutgoingStoreDetails> = {}) {
    this.id = id;
    this.rowId = rowId;
    this.barcode = barcode;
    this.productUnitId = productUnitId;
    this.qty = qty;
    this.price = price;
    this.cost = cost;
    this.productName = productName;
    this.productId = productId;
    this.barcode = barcode;
    this.productUnits = productUnits;
  }
}
