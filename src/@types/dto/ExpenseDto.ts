import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IExpenseDto {
  id?: string;
  nameEn: string;
  nameAr: string;
  names: ITranslatedName[];
  notes: string;
  code: null | string;
  branchId?: string;
}

export class ExpenseDto implements Partial<IExpenseDto> {
  id?: string;
  nameEn: string;
  nameAr: string;
  code: null | string;
  names: ITranslatedName[];
  branchId?: string;
  constructor({ id = "", nameEn = "", code = null, branchId = "", nameAr = "", names = [] }: Partial<ExpenseDto> = {}) {
    this.id = id;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
    this.code = code;
    this.names = names;
    this.branchId = branchId;
  }
}
