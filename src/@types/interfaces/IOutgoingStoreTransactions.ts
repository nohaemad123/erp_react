import { IProduct } from "@/@types/interfaces/IProduct";

export interface IOutgoingStoreTransaction {
  id: string;
  note: string;
  code: number;
  accountId: string;
  date: Date;
  outgoingStoreTypeName?: string;
  storeName?: string;
  customerName?: number;
  totalQuntity?: number;
  totalCost?: string;
  storeId: string;
  invoiceType: string;
  discountType: string;
  discountValue: number;
  details: IOutgoingStoreDetails[];
}

export interface IOutgoingStoreDetails {
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
