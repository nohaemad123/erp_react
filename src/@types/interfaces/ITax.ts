import { ITranslatedName } from "./ITranslatedName";

export interface ITax {
  id: string;
  name: string;
  names: ITranslatedName[];
  rate: number;
  code: string;
}
