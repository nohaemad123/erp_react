import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface IBranch {
  id?: string;
  names: ITranslatedName[];
  name: string;
  address: string;
  mobile: string;
  barcodeAddress: string;
  invoiceFormat: string;
  code?: null;
  createdOn?: Date;
}
