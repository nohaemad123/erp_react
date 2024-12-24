import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IProductGroupDto {
  id?: string;
  name: string;
  nameEn: string;
  nameAr: string;
  code: string;
  parentId: string | null;
  isTransactionSuspended: boolean;
  names: ITranslatedName[];
}

export class ProductGroupDto implements Partial<IProductGroupDto> {
  id?: string;
  name: string;
  nameEn: string;
  nameAr: string;
  code: string;
  parentId?: string | null;
  isTransactionSuspended: boolean;
  names: ITranslatedName[];
  constructor({
    id = "",
    name = "",
    nameEn = "",
    nameAr = "",
    code = "",
    parentId = "",
    isTransactionSuspended = false,
    names = [],
  }: Partial<ProductGroupDto> = {}) {
    this.id = id;
    this.name = name;
    this.nameAr = nameAr;
    this.nameEn = nameEn;
    this.code = code;
    this.parentId = parentId;
    this.isTransactionSuspended = isTransactionSuspended;
    this.names = names;
  }
}
