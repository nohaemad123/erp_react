export default interface IRegisterDto {
  name: string;
  email: string;
  password: string;
  username: string;
  phone: string;
  phoneNumberCountryId: string;
  confirmPassword: string;
}

export class RegisterDto implements Partial<IRegisterDto> {
  name: string;
  email: string;
  phone: string;
  phoneNumberCountryId: string;
  username: string;
  password: string;
  confirmPassword: string;
  constructor({
    name = "",
    phone = "",
    phoneNumberCountryId = "",
    email = "",
    username = "",
    password = "",
    confirmPassword = "",
  }: Partial<IRegisterDto> = {}) {
    this.name = name;
    this.phone = phone;
    this.phoneNumberCountryId = phoneNumberCountryId;
    this.email = email;
    this.username = username;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }
}
