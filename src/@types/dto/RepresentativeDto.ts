import { IRepresentativeRegion } from "@/@types/interfaces/IRepresentative";

export interface IRepresentativeDto {
  id?: string;
  name: string;
  code: number;
  branchId: string;
  regonIds: IRepresentativeRegion[];
  telephone: string;
  countryMobileId: string | null;
  address: string;
  mobile: string | null;
  commissionTypeId: number | null;
  commissionRate: number | null;
  collectionCommission: number | null;
  isTransactionSuspended: boolean;
}

export class RepresentativeDto implements Partial<IRepresentativeDto> {
  id?: string;
  name: string;
  code: 0;
  branchId: string;
  regonIds: IRepresentativeRegion[];
  telephone: string;
  countryMobileId: string | null;
  mobile: string | null;
  address: string;
  commissionTypeId: number | null;
  commissionRate: number | null;
  collectionCommission: number | null;
  isTransactionSuspended: boolean;
  constructor({
    id = "",
    name = "",
    code = 0,
    branchId = "",
    countryMobileId = null,
    regonIds = [],
    mobile = "",
    telephone = "",
    address = "",
    commissionTypeId = null,
    commissionRate = null,
    collectionCommission = null,
    isTransactionSuspended = false,
  }: Partial<IRepresentativeDto> = {}) {
    this.id = id;
    this.name = name;
    this.code = code as 0;
    this.branchId = branchId;
    this.countryMobileId = countryMobileId;
    this.regonIds = regonIds;
    this.mobile = mobile;
    this.telephone = telephone;
    this.address = address;
    this.commissionTypeId = commissionTypeId;
    this.commissionRate = commissionRate;
    this.collectionCommission = collectionCommission;
    this.isTransactionSuspended = isTransactionSuspended;
  }
}
