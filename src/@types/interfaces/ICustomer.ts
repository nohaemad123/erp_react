import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface ICustomer {
  id?: string;
  address: string;
  countryName: string;
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
  creditLimit: number;
  taxNumber: string;
  tradeLicense: string;
  discountRate: number;
  customerPrice: string;
  customerPriceId: number;
  otherIdentifier: string;
  balanceFirstDuration: number;
  balance: number;
  paymentMethod: string;
  paymentMethodId: number;
  isTransactionSuspended: boolean;
  notes: string;
  name: string;
  names: ITranslatedName[];
}
