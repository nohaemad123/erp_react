import { SortColumnType } from "@/@types/types/sortColumnType";

export interface ISearchDto {
  page: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  readDto: any;
  selectColumns: string[];
  sortColumnDirection?: SortColumnType;
}

export class SearchDto implements ISearchDto {
  page: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  readDto: any;
  selectColumns: string[];
  sortColumnDirection?: SortColumnType;
  constructor({
    page = 1,
    pageSize = 10,
    search = "",
    readDto,
    selectColumns = ["id", "name"],
    sortColumnDirection,
    sortColumn = "",
  }: Partial<ISearchDto> = {}) {
    this.page = page;
    this.pageSize = pageSize;
    this.search = search;
    this.sortColumn = sortColumn;
    this.sortColumnDirection = sortColumnDirection;
    this.readDto = readDto;
    this.selectColumns = selectColumns;
  }
}
