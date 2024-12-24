export interface IUserLogin {
  message?: string;
  isAuthenticated?: boolean;
  username?: string;
  email?: string;
  token?: string;
  expiresOn?: string;
  language?: string;
  storeUserId?: string | null;
  role?: string;
}

export interface IUser {
  id: string;
  name: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  address: string;
  nationalityId: string;
  email: string;
  roles: string[];
  defaultLanguage: string;
  branchUser: string[];
  storeUser: string[];
  sendDataToMail: boolean;
  isActive: boolean;
  lastLogIn: string;
  username?: string;
}
