import { ISupplier } from "@/@types/interfaces/ISupplier";
import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface ISupplierDto extends Partial<ISupplier> {
  nameEn: string;
  nameAr: string;
}

export class SupplierDto implements Partial<ISupplierDto> {
  id?: string;
  nameEn: string;
  nameAr: string;
  address: string;
  balance: number;
  balanceFirstDuration: number;
  code: string | null;
  mobile: string;
  telephone: string;
  city: string;
  countryId: string | null;
  mobileCountryId: string | null;
  street: string;
  postalCode: string;
  neighborhoodNumber: string;
  vendorGroupId: string;
  buildingNumber: string;
  regionId: string | null;
  taxNumber: string;
  tradeLicense: string;
  dealingDiscount: number;
  vendorPriceId: number;
  otherIdentifier: string;
  paymentMethodId: number;
  debitLimit: number;
  isTransactionSuspended: boolean;
  notes: string;
  names: Partial<ITranslatedName>[];
  constructor({
    id,
    nameAr = "",
    nameEn = "",
    code = null,
    mobile = "",
    telephone = "",
    city = "",
    countryId = null,
    mobileCountryId = null,
    street = "",
    postalCode = "",
    neighborhoodNumber = "",
    vendorGroupId = "",
    buildingNumber = "",
    address = "",
    regionId = null,
    taxNumber = "0",
    tradeLicense = "",
    dealingDiscount = 0,
    balanceFirstDuration = 0,
    vendorPriceId = 1,
    otherIdentifier = "0",
    paymentMethodId = 1,
    debitLimit = 0,
    isTransactionSuspended = false,
    notes = "",
    balance = 0,
    names = [],
  }: Partial<SupplierDto> = {}) {
    this.id = id;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
    this.address = address;
    this.balance = balance;
    this.balanceFirstDuration = balanceFirstDuration;
    this.code = code;
    this.mobile = mobile;
    this.telephone = telephone;
    this.city = city;
    this.countryId = countryId;
    this.mobileCountryId = mobileCountryId;
    this.street = street;
    this.postalCode = postalCode;
    this.neighborhoodNumber = neighborhoodNumber;
    this.vendorGroupId = vendorGroupId;
    this.buildingNumber = buildingNumber;
    this.regionId = regionId;
    this.taxNumber = taxNumber;
    this.tradeLicense = tradeLicense;
    this.dealingDiscount = dealingDiscount;
    this.vendorPriceId = vendorPriceId;
    this.otherIdentifier = otherIdentifier;
    this.paymentMethodId = paymentMethodId;
    this.debitLimit = debitLimit;
    this.isTransactionSuspended = isTransactionSuspended;
    this.notes = notes;
    this.names = names;
  }
}
