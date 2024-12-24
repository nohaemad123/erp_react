import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface ITaxDto {
  id?: string;
  nameEn: string;
  nameAr: string;
  code: string | null;
  rate: number;
  names: ITranslatedName[];
}

export class TaxDto implements Partial<ITaxDto> {
  id?: string;
  nameEn: string;
  nameAr: string;
  code: string;
  rate: number;
  names: ITranslatedName[];
  constructor({ id = "", nameEn = "", nameAr = "", code = "", rate = 0, names = [] }: Partial<TaxDto> = {}) {
    this.id = id;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
    this.code = code;
    this.rate = rate;
    this.names = names;
  }
}
