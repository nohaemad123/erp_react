import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";

export interface ISupplier {
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
  vendorGroupId: string;
  venderGroupId: string;
  buildingNumber: string;
  regionId: string | null;
  debitLimit: number;
  taxNumber: string;
  tradeLicense: string;
  dealingDiscount: number;
  venderPrice: string;
  venderPriceId: number;
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
