import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface IProductGroup {
  createdOn: string;
  name: string;
  parentName: string;
  subGroups: IProductGroup[]; // Recursive structure for nested subGroups
  id: string;
  code: string;
  isTransactionSuspended: boolean;
  parentId: string;
  names: ITranslatedName[];
}

export interface IGroup {
  createdOn: string;
  name: string;
  parentName: string;
  subGroups: IProductGroup[]; // Sub-groups within this group
  id: string;
  code: string;
  isTransactionSuspended: boolean;
  parentId: string;
  names: ITranslatedName[];
}
