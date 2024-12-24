import { invalidMsg } from "@/@types/validators";
import { object, optional, string } from "valibot";

export interface IUserSearchDto {
  page: number;
  pageSize: number;
  Search: string;
  readDto: any;
  selectColumns: string[];
}

export class UserSearchDto implements Partial<IUserSearchDto> {
  page?: number;
  pageSize?: number;
  Search?: string;
  readDto?: any;
  selectColumns?: string[];
  constructor({ page, pageSize, Search, readDto, selectColumns }: Partial<IUserSearchDto> = {}) {
    this.page = page;
    this.pageSize = pageSize;
    this.Search = Search;
    this.readDto = readDto;
    this.selectColumns = selectColumns;
  }
}

export const userSearchValidationSchema = object({
  search: optional(string(invalidMsg)),
  searchRoles: optional(string(invalidMsg)),
  searchBranchs: optional(string(invalidMsg)),
});
