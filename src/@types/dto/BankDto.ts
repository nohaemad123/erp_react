import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface IBankDto {
  nameEn: string;
  nameAr: string;
  countryMobileId: null | string;
  address: string;
  mobile: string;
  email: string;
  code: number | null;
  balanceFirstDuration: number;
  balance: number;
  notes: string;
  id?: string;
  names: ITranslatedName[];
  branchId: string;
}

export class BankDto implements Partial<IBankDto> {
  nameEn: string;
  nameAr: string;
  countryMobileId: null | string;
  code: number | null;
  address: string;
  email: string;
  mobile: string;
  id?: string;
  balance: number;
  notes: string;
  balanceFirstDuration: number;
  names: ITranslatedName[];
  branchId?: string;
  constructor({
    nameEn = "",
    id,
    notes = "",
    balance = 0,
    balanceFirstDuration = 0,
    email = "",
    nameAr = "",
    countryMobileId = null,
    code = 0,
    address = "",
    mobile = "",
    names = [],
    branchId = "",
  }: Partial<BankDto> = {}) {
    this.nameEn = nameEn;
    this.balanceFirstDuration = balanceFirstDuration;
    this.nameAr = nameAr;
    this.balance = balance;
    this.email = email;
    this.notes = notes;
    this.code = code;
    this.address = address;
    this.mobile = mobile;
    this.countryMobileId = countryMobileId;
    this.names = names;
    this.branchId = branchId;
    this.id = id;
  }
}
