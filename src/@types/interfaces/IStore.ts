import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IStore {
  id?: string;
  name: string;
  storeKeeperName: string;
  storeKeeperId: string;
  branchId: string;
  address: string;
  telephone: string;
  mobile: string;
  code: string;
  names: ITranslatedName[];
}
