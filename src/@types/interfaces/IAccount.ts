import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IAccount {
  id: string;
  parentID: string;
  accountCode: string;
  accountTypesId: string;
  name: string;
  names: ITranslatedName[];
  notes: string;
  isSub: boolean;
  balance: number;
}
