import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IProductUnit {
  id: string;
  rowId: string;
  barcode: string;
  unitName: string;
  productId: string | null;
  unitItemTypeId: string;
  salePrice: number;
  purchasPrice: number;
  priceRate: number;
  lowestSellingPrice: number;
  wholesalePrice: number;
  customerPrice: number;
  isDefault: boolean;
}

export interface IProductTaxType {
  productId: string | null;
  taxTypeId: string;
  taxRate: number;
  taxName: string;
}

export interface IProduct {
  name: string;
  id: string;
  modelNumber: string;
  vendorId: string;
  productGroupId: string;
  defaultUnitId: null;

  code: number;
  reorderLimit: number;
  maxLimit: number;
  minLimit: number;
  commission: number;
  discount: number;
  maxDiscount: number;
  taxRatio: number;
  customerPoints: number;

  isNonReturnable: boolean;
  isCashOnly: boolean;
  isTransactionSuspended: boolean;

  names: ITranslatedName[];
  productTaxType: IProductTaxType[];
  productUnits: IProductUnit[];
}
