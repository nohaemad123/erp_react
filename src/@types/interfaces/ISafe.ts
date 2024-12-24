import { ITranslatedName } from "./ITranslatedName";

export interface ISafe {
  id?: string;
  nameAr: string;
  nameEn: string;
  names: ITranslatedName[];
  balanceFirstDuration: number;
  branchId?: string;
  notes: string;
  createdOn?: Date;
  name?: string;
}
