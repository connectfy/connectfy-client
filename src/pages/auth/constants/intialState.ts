import {
  IForgotPasswordForm,
  IGoogleSignupForm,
  ILoginForm,
  IResetPasswordForm,
  ISignupForm,
  ISignupVerifyForm,
} from "@/types/auth/auth/auth.type";
import {
  FORGOT_PASSWORD_IDENTIFIER_TYPE,
  IDENTIFIER_TYPE,
  THEME,
} from "@/types/enum.types";
// import { COUNTRIES } from "./constant";

const theme = localStorage.getItem("app-theme") as THEME;

export const loginInitialState: ILoginForm = {
  identifierType: IDENTIFIER_TYPE.USERNAME,
  identifier: null,
  password: null,
};

export const signupInitialState: ISignupForm = {
  firstName: null,
  lastName: null,
  username: null,
  email: null,
  gender: null,
  password: null,
  confirm: null,
  birthdayDate: null,
  theme,
  // phoneNumber: {
  //   countryCode: COUNTRIES[0].code,
  //   number: null,
  //   fullPhoneNumber: null,
  // },
};

export const verifySignupInitialState: ISignupVerifyForm = {
  verifyCode: null,
};

export const forgotPasswordInitialState: IForgotPasswordForm = {
  identifierType: FORGOT_PASSWORD_IDENTIFIER_TYPE.EMAIL,
  identifier: null,
};

export const resetPasswordInitialState: IResetPasswordForm = {
  password: null,
  confirmPassword: null,
  resetToken: null,
};

export const googleSignupInitialState: IGoogleSignupForm = {
  idToken: null,
  username: null,
  // phoneNumber: {
  //   countryCode: COUNTRIES[0].code,
  //   number: null,
  //   fullPhoneNumber: null,
  // },
  gender: null,
  birthdayDate: null,
  theme,
};
