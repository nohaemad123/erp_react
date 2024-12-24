export default interface ILoginDto {
  email: string;
  password: string;
}

export class LoginDto implements Partial<ILoginDto> {
  email: string;
  password: string;
  constructor({ email = "ahmedfathy@gmail.com", password = "123456789" }: Partial<ILoginDto> = {}) {
    this.password = password;
    this.email = email;
  }
}
