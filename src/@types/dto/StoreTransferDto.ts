import { IProductUnits } from "@/@types/interfaces/IOutgoingStoreTransactions";
import { IStoreTransferDetails } from "@/@types/interfaces/IStoreTransferTransaction";
import { customId } from "@/@types/stables";

export interface IStoreTransactionDto {
  code: number;
  id?: string;
  note: string;
  storeId: string;
  fromStoreName: string;
  toStoreId?: string;
  toStoreName: string;
  date: Date;
  branchId: string;
  details: IStoreTransferDetails[];
}

export class StoreTransactionDto implements Partial<IStoreTransactionDto> {
  code: number;
  id?: string;
  note: string;
  date: Date;
  storeId: string;
  fromStoreName: string;
  toStoreId?: string;
  toStoreName: string;
  branchId: string;
  details: IStoreTransferDetails[];
  constructor({
    id,
    code = 0,
    note = "",
    storeId = "",
    fromStoreName = "",
    toStoreId = "",
    toStoreName = "",
    date = new Date(),
    branchId = "",
    details = [],
  }: Partial<StoreTransactionDto> = {}) {
    this.code = code;
    this.id = id;
    this.note = note;
    this.storeId = storeId;
    this.fromStoreName = fromStoreName;
    this.toStoreId = toStoreId;
    this.toStoreName = toStoreName;
    this.date = date;
    this.branchId = branchId;
    this.details = details;
  }
}

export class StoreTransactionRow implements Partial<IStoreTransferDetails> {
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
  }: Partial<IStoreTransferDetails> = {}) {
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
