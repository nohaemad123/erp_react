export interface IRepresentative {
  createdOn: string;
  id?: string;
  code: number;
  branchId: string;
  name: string;
  countryMobileId: string;
  mobile: string;
  telephone: string;
  address: string;
  collectionCommission: number;
  commissionRate: number;
  commissionType: string;
  isTransactionSuspended: boolean;
  regonIds: IRepresentativeRegion[];
  regons: string;
  commissionTypeId: number;
  creationDate: string;
}

export interface IRepresentativeRegion {
  regionId: string;
  name?: string;
}
