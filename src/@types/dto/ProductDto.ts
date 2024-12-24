import { IProductTaxType, IProductUnit } from "@/@types/interfaces/IProduct";
import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";
import { customId } from "@/@types/stables";

export interface IProductDto {
  id?: string;
  nameEn: string;
  nameAr: string;
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

  isCashOnly: boolean;
  isNonReturnable: boolean;
  isTransactionSuspended: boolean;

  names: ITranslatedName[];
  productUnits: ProductUnitRow[];
  productTaxType: IProductTaxType[];
}

export class ProductDto implements Partial<IProductDto> {
  id?: string;
  nameEn: string;
  nameAr: string;
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

  isTransactionSuspended: boolean;
  isNonReturnable: boolean;
  isCashOnly: boolean;

  names: ITranslatedName[];
  productUnits: ProductUnitRow[];
  productTaxType: IProductTaxType[];

  constructor({
    id,
    nameEn = "",
    nameAr = "",
    code = 0,
    defaultUnitId = null,
    vendorId = "",
    modelNumber = "",
    productGroupId = "",

    commission = 0,
    customerPoints = 0,
    discount = 0,
    maxDiscount = 0,
    maxLimit = 0,
    minLimit = 0,
    reorderLimit = 0,
    taxRatio = 0,

    isTransactionSuspended = false,
    isNonReturnable = false,
    isCashOnly = false,

    names = [],
    productUnits = [],
    productTaxType = [],
  }: Partial<ProductDto> = {}) {
    this.id = id;
    this.nameAr = nameAr;
    this.nameEn = nameEn;
    this.code = code;
    this.isTransactionSuspended = isTransactionSuspended;
    this.names = names;

    this.commission = commission;
    this.customerPoints = customerPoints;
    this.isNonReturnable = isNonReturnable;
    this.isCashOnly = isCashOnly;
    this.defaultUnitId = defaultUnitId;
    this.vendorId = vendorId;
    this.discount = discount;
    this.maxDiscount = maxDiscount;
    this.maxLimit = maxLimit;
    this.minLimit = minLimit;
    this.modelNumber = modelNumber;
    this.productGroupId = productGroupId;
    this.productTaxType = productTaxType;
    this.productUnits = productUnits;
    this.reorderLimit = reorderLimit;
    this.taxRatio = taxRatio;
  }
}

export class ProductUnitRow implements Partial<IProductUnit> {
  id: string;
  rowId: string;
  barcode: string;
  customerPrice: number;
  lowestSellingPrice: number;
  priceRate: number;
  productId: string | null;
  purchasPrice: number;
  salePrice: number;
  unitItemTypeId: string;
  unitName: string;
  wholesalePrice: number;

  constructor({
    id = "",
    rowId = customId(),
    barcode = "",
    customerPrice = 0,
    lowestSellingPrice = 0,
    priceRate = 0,
    productId = null,
    purchasPrice = 0,
    salePrice = 0,
    unitItemTypeId = "",
    unitName = "",
    wholesalePrice = 0,
  }: Partial<IProductUnit> = {}) {
    this.id = id;
    this.rowId = rowId;
    this.barcode = barcode;
    this.customerPrice = customerPrice;
    this.lowestSellingPrice = lowestSellingPrice;
    this.priceRate = priceRate;
    this.productId = productId;
    this.purchasPrice = purchasPrice;
    this.salePrice = salePrice;
    this.unitItemTypeId = unitItemTypeId;
    this.unitName = unitName;
    this.wholesalePrice = wholesalePrice;
  }
}
