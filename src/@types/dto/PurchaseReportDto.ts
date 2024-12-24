export interface IPurchaseReportDto {
  dateFrom: string;
  dateTo: string;
  userIds: string[];
  itemIds: string[];
  invoiceDealType: number;
  storeIds: string[];
  vendorIds: string[];
  itemGroups: string[];
}

export class PurchaseReportDto implements Partial<IPurchaseReportDto> {
  dateFrom: string;
  dateTo: string;
  userIds: string[];
  itemIds: string[];
  invoiceDealType: number;
  storeIds: string[];
  vendorIds: string[];
  itemGroups: string[];
  constructor({
    dateFrom = "",
    dateTo = "",
    userIds = [],
    itemIds = [],
    invoiceDealType = 0,
    storeIds = [],
    vendorIds = [],
    itemGroups = [],
  }: Partial<IPurchaseReportDto> = {}) {
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.userIds = userIds;
    this.itemIds = itemIds;
    this.invoiceDealType = invoiceDealType;
    this.storeIds = storeIds;
    this.vendorIds = vendorIds;
    this.itemGroups = itemGroups;
  }
}
