export interface IUsersDto {
  name: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  phoneNumberCountryId: string;
  address: string;
  nationalityId: string;
  email: string;
  roles: string[];
  defaultLanguage: string;
  branchUser: string[];
  storeUser: string[];
  sendDataToMail: boolean;
}

export class UsersDto implements Partial<IUsersDto> {
  name: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  phoneNumberCountryId: string;
  address: string;
  defaultLanguage: string;
  nationalityId: string;
  roles: string[];
  sendDataToMail: boolean;
  branchUser: string[];
  storeUser: string[];
  email: string;
  constructor({
    name = "",
    password = "",
    confirmPassword = "",
    phoneNumber = "",
    phoneNumberCountryId = "",
    address = "",
    defaultLanguage = "",
    nationalityId = "",
    sendDataToMail = false,
    email = "",
    roles = [],
    storeUser = [],
    branchUser = [],
  }: Partial<IUsersDto> = {}) {
    this.name = name;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.phoneNumber = phoneNumber;
    this.phoneNumberCountryId = phoneNumberCountryId;
    this.address = address;
    this.confirmPassword = confirmPassword;
    this.confirmPassword = confirmPassword;
    this.defaultLanguage = defaultLanguage;
    this.nationalityId = nationalityId;
    this.roles = roles;
    this.sendDataToMail = sendDataToMail;
    this.branchUser = branchUser;
    this.storeUser = storeUser;
    this.email = email;
  }
}
