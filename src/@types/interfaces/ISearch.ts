export interface ISearch {
  page: number;
  pageSize: number;
  search: string;
  readDto: any;
  selectColumns?: string[];
}

export interface IFilterCriteria {
  page: number;
  pageSize: number;
  search: string;
  readDto: any;
  sortColumn: string;
  sortColumnDirection: string;
}
