import { ITranslatedName } from "./ITranslatedName";

export interface IExpense {
  id?: string;
  nameAr: string;
  nameEn: string;
  names: ITranslatedName[];
  name?: string;
  branchId?: string;
  notes: string;
  createdOn?: Date;
}
