import { IProductUnit } from "@/@types/interfaces/IProduct";

export interface IIncomingStoreTransaction {
  id: string;
  note: string;
  code: number;
  accountId: string;
  date: Date;
  incomingStoreTypeName?: string;
  storeName?: string;
  vendorName?: string;
  totalQuntity?: number;
  totalCost?: number;
  storeId: string;
  invoiceType: string;
  discountType: string;
  discountValue: number;
  details: IIncomingStoreDetails[];
}

export interface IIncomingStoreDetails {
  id: string;
  productUnitId: string;
  qty: number | null;
  price: number | null;
  rowId: string;
  cost: number | null;
  transactionType: string;
  storeTransactionHeadId: string;
  transactionHeadId: string;
  productName: string;
  productId: string;
  barcode: string;
  productUnits: IProductUnit[];
}
