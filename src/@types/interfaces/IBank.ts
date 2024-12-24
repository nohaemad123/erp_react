import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface IBank {
  names?: ITranslatedName[];
  address: string;
  mobile: string;
  name?: string;
  // countryMobileId: null | string;
  email: string;
  branchId: string;
  notes: string;
  id?: string;
  balance: number;
  code?: number;
  balanceFirstDuration: number;
  createdOn?: Date;
}
