import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IUnitDto {
  id?: string;
  nameEn: string;
  nameAr: string;
  factor: number;
  names: ITranslatedName[];
}

export class UnitDto implements Partial<IUnitDto> {
  id?: string;
  nameEn: string;
  nameAr: string;
  factor: number;
  names: ITranslatedName[];
  constructor({ id, nameEn = "", nameAr = "", factor = 0, names = [] }: Partial<IUnitDto> = {}) {
    this.id = id;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
    this.factor = factor;
    this.names = names;
  }
}
