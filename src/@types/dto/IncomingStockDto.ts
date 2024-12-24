import { IIncomingStoreDetails } from "@/@types/interfaces/IIncomingStoreTransactions";
import { IProductUnit } from "@/@types/interfaces/IProduct";
import { customId } from "@/@types/stables";

export interface IIncomingStockDto {
  code: number;
  id?: string;
  note: string;
  accountId: string;
  incomingStoreType: string;
  date: Date;
  branchId: string;
  storeId: string;
  details: IIncomingStoreDetails[];
}

export class IncomingStockDto implements Partial<IIncomingStockDto> {
  code: number;
  id?: string;
  note: string;
  incomingStoreType: string;
  accountId: string;
  date: Date;
  branchId: string;
  storeId: string;
  details: IIncomingStoreDetails[];
  constructor({
    id,
    code = 0,
    note = "",
    incomingStoreType = "",
    accountId = "",
    date = new Date(),
    branchId = "",
    storeId = "",
    details = [],
  }: Partial<IncomingStockDto> = {}) {
    this.code = code;
    this.id = id;
    this.note = note;
    this.incomingStoreType = incomingStoreType;
    this.accountId = accountId;
    this.date = date;
    this.branchId = branchId;
    this.storeId = storeId;
    this.details = details;
  }
}

export class IncomingStockRow implements Partial<IIncomingStoreDetails> {
  id: string;
  rowId: string;
  productUnitId: string;
  qty: number | null;
  price: number | null;
  cost: number | null;
  productName: string;
  productId: string;
  barcode: string;
  productUnits: IProductUnit[];

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
  }: Partial<IIncomingStoreDetails> = {}) {
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
