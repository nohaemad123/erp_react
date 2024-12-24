import { ICustomer } from "@/@types/interfaces/ICustomer";
import { ITranslatedName } from "../interfaces/ITranslatedName";

export interface ICustomerDto extends Partial<ICustomer> {
  nameEn: string;
  nameAr: string;
}

export class CustomerDto implements Partial<ICustomerDto> {
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
  customerGroupId: string;
  buildingNumber: string;
  regionId: string | null;
  taxNumber: string;
  tradeLicense: string;
  discountRate: number;
  customerPriceId: number;
  otherIdentifier: string;
  paymentMethodId: number;
  creditLimit: number;
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
    customerGroupId = "",
    buildingNumber = "",
    address = "",
    regionId = null,
    taxNumber = "0",
    tradeLicense = "",
    discountRate = 0,
    balanceFirstDuration = 0,
    customerPriceId = 1,
    otherIdentifier = "0",
    paymentMethodId = 1,
    creditLimit = 0,
    isTransactionSuspended = false,
    notes = "",
    balance = 0,
    names = [],
  }: Partial<CustomerDto> = {}) {
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
    this.customerGroupId = customerGroupId;
    this.buildingNumber = buildingNumber;
    this.regionId = regionId;
    this.taxNumber = taxNumber;
    this.tradeLicense = tradeLicense;
    this.discountRate = discountRate;
    this.customerPriceId = customerPriceId;
    this.otherIdentifier = otherIdentifier;
    this.paymentMethodId = paymentMethodId;
    this.creditLimit = creditLimit;
    this.isTransactionSuspended = isTransactionSuspended;
    this.notes = notes;
    this.names = names;
  }
}
