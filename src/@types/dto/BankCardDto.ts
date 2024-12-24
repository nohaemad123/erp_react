import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IBankCardDto {
  id?: string;
  nameEn: string;
  nameAr: string;
  bankId: string;
  discountPercentage: number;
  names: ITranslatedName[];
  branchId?: string;
  isDefault?: boolean;
}

export class BankCardDto implements Partial<IBankCardDto> {
  id?: string;
  nameEn: string;
  nameAr: string;
  branchId?: string;
  names: ITranslatedName[];
  bankId: string;
  discountPercentage: number;
  isDefault?: boolean;
  constructor({
    id,
    nameEn = "",
    names = [],
    branchId = "",
    nameAr = "",
    bankId = "",
    discountPercentage = 0,
    isDefault = false,
  }: Partial<BankCardDto> = {}) {
    this.nameEn = nameEn;
    this.id = id;
    this.bankId = branchId;
    this.names = names;
    this.nameAr = nameAr;
    this.bankId = bankId;
    this.discountPercentage = discountPercentage;
    this.isDefault = isDefault;
  }
}
