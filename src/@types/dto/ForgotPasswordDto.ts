export default interface IForgotPassword {
  name: string;
  email: string;
  password: string;
  username: string;
  phone: string;
  phoneNumberCountryId: string;
  confirmPassword: string;
}

export class ForgotPasswordDto implements Partial<IForgotPassword> {
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
  }: Partial<IForgotPassword> = {}) {
    this.name = name;
    this.phone = phone;
    this.phoneNumberCountryId = phoneNumberCountryId;
    this.email = email;
    this.username = username;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }
}
