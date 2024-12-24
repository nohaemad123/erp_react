import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface IBankCard {
  id?: string;
  name?: string;
  bankName?: string;
  names?: ITranslatedName[];
  bankId?: string;
  discountPercentage?: number;
  createdOn?: Date;
  isDefault?: boolean;
}
