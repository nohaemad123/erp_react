import { IProduct } from "@/@types/interfaces/IProduct";

export interface IStoreTransferTransaction {
  id: string;
  note: string;
  code: number;
  date: Date;
  storeId: string;
  fromStoreName: string;
  toStoreId: string;
  toStoreName: string;
  totalCost: number;
  totalPrice: number;
  totalQuantity: number;
  details: IStoreTransferDetails[];
}

export interface IStoreTransferDetails {
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
  productUnits: IProductUnits[];
}

export interface IProductUnits {
  id: string;
  barcode: string;
  unitName: string;
  productId: string;
  unitItemTypeId: string;
  salePrice: number;
  purchasPrice: number;
  priceRate: number;
  isDefault: boolean;
  lowestSellingPrice: number;
  wholesalePrice: number;
  customerPrice: number;
  product?: IProduct;
}
