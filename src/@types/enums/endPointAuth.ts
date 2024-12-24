export const END_POINT_AUTH = {
  GENERAL: {},
  AUTH: {
    CREATE_TENANT: "Tenant/TenantManagement/CreteTenant",
    LOGIN_WITH_TENANT: "Tenant/TenantManagement/UserLogIn",
    LOGIN_WITHOUT_TENANT: "Tenant/TenantManagement/LogIn",
    //   FORGOT_PASSWORD: '/Auth/ForgotPassword',
    //   CHECK_OTP: '/Auth/CheckOTPCode',
    //   RESET_PASSWORD: '/Auth/ResetPassword',
    //   GET_ALL_COUNTRIES: '/Country/GetAllCountries',
    //   REGISTER_STORE_ADMIN: '/Auth/registerStoreAdmin',
  },
  STORE: {
    GET_ALL_STORE: "Store",
  },
  BRANCH: {
    GET_ALL_BRANCH: "Branch/GetAll",
    ADD_BRANCH: "Branch",
    GET_BRANCH_BY_ID: "Branch/",
    UPDATE_BRANCH: "Branch?id=",
  },
  COUNTRY: {
    GET_ALL_COUNTRY: "Country",
  },
  ROLE_USER: {
    GET_ALL_ROLE_USER: "RoleUser",
  },
  USER: {
    CREATE_USER: "User",
    GET_ALL_USER: "User",
    USER_BY_ID: "User/",
    UPDATE_USER: "User?id=",
  },
  BANK_CARDS: {
    GET_ALL_BANK_CARDS: "BankCard",
    ADD_BANK_CARDS: "BankCard",
    UPDATE_BANK_CARDS: "BankCard?id=",
    GET_BANK_CARDS_BY_ID: "BankCard/",
  },
  BANK: {
    GET_ALL_BANK: "Bank",
  },
};
