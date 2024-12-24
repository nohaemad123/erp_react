import { ITranslatedName } from "./ITranslatedName";

export interface IUnit {
  id: string;
  name: string;
  names: ITranslatedName[];
  factor: number;
}
