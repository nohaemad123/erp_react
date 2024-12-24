import { SortColumnType } from "@/@types/types/sortColumnType";

export interface IStockSearchDto {
  page: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  readDto: {
    from?: Date | null;
    to?: Date | null;
  };
  selectColumns?: string[];
  sortColumnDirection?: SortColumnType;
}

export class StockSearchDto implements IStockSearchDto {
  page: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  readDto: {
    from?: Date | null;
    to?: Date | null;
  };
  selectColumns?: string[];
  sortColumnDirection?: SortColumnType;
  constructor({
    page = 1,
    pageSize = 10,
    search = "",
    readDto = { from: null, to: null },
    selectColumns,
    sortColumnDirection,
    sortColumn = "",
  }: Partial<IStockSearchDto> = {}) {
    this.page = page;
    this.pageSize = pageSize;
    this.search = search;
    this.sortColumn = sortColumn;
    this.sortColumnDirection = sortColumnDirection;
    this.readDto = readDto;
    this.selectColumns = selectColumns;
  }
}
