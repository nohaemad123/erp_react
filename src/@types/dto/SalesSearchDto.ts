import { SortColumnType } from "@/@types/types/sortColumnType";

export interface ISalesSearchDto {
  page: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  readDto: {
    dateFrom?: Date | null;
    dateTo?: Date | null;
  };
  selectColumns?: string[];
  sortColumnDirection?: SortColumnType;
}

export class SalesSearchDto implements ISalesSearchDto {
  page: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  readDto: {
    dateFrom?: Date | null;
    dateTo?: Date | null;
  };
  selectColumns?: string[];
  sortColumnDirection?: SortColumnType;
  constructor({
    page = 1,
    pageSize = 10,
    search = "",
    readDto = { dateFrom: null, dateTo: null },
    selectColumns,
    sortColumnDirection,
    sortColumn = "",
  }: Partial<ISalesSearchDto> = {}) {
    this.page = page;
    this.pageSize = pageSize;
    this.search = search;
    this.sortColumn = sortColumn;
    this.sortColumnDirection = sortColumnDirection;
    this.readDto = readDto;
    this.selectColumns = selectColumns;
  }
}