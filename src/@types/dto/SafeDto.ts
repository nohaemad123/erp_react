import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface ISafeDto {
  id?: string;
  nameEn: string;
  nameAr: string;
  balanceFirstDuration: number;
  names: ITranslatedName[];
  notes: string;
  branchId?: string;
}

export class SafeDto implements Partial<ISafeDto> {
  id?: string;
  nameEn: string;
  nameAr: string;
  balanceFirstDuration: number;
  names: ITranslatedName[];
  branchId?: string;
  constructor({ id, nameEn = "", branchId = "", nameAr = "", balanceFirstDuration = 0, names = [] }: Partial<SafeDto> = {}) {
    this.id = id;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
    this.balanceFirstDuration = balanceFirstDuration;
    this.names = names;
    this.branchId = branchId;
  }
}
