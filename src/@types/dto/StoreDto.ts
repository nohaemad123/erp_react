import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IStoreDto {
  nameEn: string;
  nameAr: string;
  countryMobileId: string | null;
  mobile: string;
  storeKeeperId: string | null;
  id?: string;
  names: ITranslatedName[];
  address: string;
  telephone: string;
  branchId?: string;
  code: string;
  notes: string;
}

export class StoreDto implements Partial<IStoreDto> {
  nameEn: string;
  id?: string;
  nameAr: string;
  telephone: string;
  branchId?: string;
  countryMobileId: string | null;
  mobile: string;
  storeKeeperId: string | null;
  address: string;
  code: string;
  names: ITranslatedName[];
  notes: string;
  constructor({
    nameEn = "",
    telephone = "",
    id,
    branchId = "",
    notes = "",
    nameAr = "",
    names = [],
    code = "0",
    countryMobileId = null,
    mobile = "",
    storeKeeperId = null,
    address = "",
  }: Partial<StoreDto> = {}) {
    this.nameEn = nameEn;
    this.code = code;
    this.nameAr = nameAr;
    this.notes = notes;
    this.branchId = branchId;
    this.countryMobileId = countryMobileId;
    this.mobile = mobile;
    this.storeKeeperId = storeKeeperId;
    this.address = address;
    this.names = names;
    this.id = id;
    this.telephone = telephone;
  }
}
