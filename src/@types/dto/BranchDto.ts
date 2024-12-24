import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface IBranchDto {
  nameEn: string;
  nameAr: string;
  id?: string;
  code: null;
  address: string;
  mobile: string;
  invoiceFormat: string;
  barcodeAddress: string;
  names: ITranslatedName[];
}

export class BranchDto implements Partial<IBranchDto> {
  nameEn: string;
  nameAr: string;
  id?: string;
  code: null;
  address: string;
  mobile: string;
  invoiceFormat: string;
  barcodeAddress: string;
  names: ITranslatedName[];
  constructor({
    id,
    nameEn = "",
    nameAr = "",
    code = null,
    address = "",
    mobile = "",
    invoiceFormat = "",
    barcodeAddress = "",
    names = [],
  }: Partial<BranchDto> = {}) {
    this.id = id;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
    this.code = code;
    this.address = address;
    this.mobile = mobile;
    this.invoiceFormat = invoiceFormat;
    this.barcodeAddress = barcodeAddress;
    this.names = names;
  }
}
