import {
  FORGOT_PASSWORD_IDENTIFIER_TYPE,
  GENDER,
  IDENTIFIER_TYPE,
} from "../enum.types";

export type AuthFormType =
  | "login"
  | "signup"
  | "verify"
  | "forgotPassword"
  | "resetPassword";

export type LoginModeType =
  | "email"
  | "username"
  | "phoneNumber"
  | "faceDescriptor";

export type ForgotPasswordModeType = "email" | "phoneNumber";

export type Country = {
  key: string;
  name: string;
  flag: string;
  code: string;
  numberLength: number;
};

export interface ILoginResponse {
  access_token: string;
}

export interface ISignupResponse {
  statusCode: number;
}

export interface ISignupVerifyResponse {
  _id: string;
  access_token: string;
}

export interface IForgotPasswordResponse {
  statusCode: number;
  email?: string;
}

export interface IResetPasswordResponse {
  statusCode: number;
}

export interface ILogoutResponse {
  statusCode: number;
}

export interface ILoginForm {
  identifierType: IDENTIFIER_TYPE;
  identifier: string | null;
  password: string | null;
}

export interface IPhoneNumber {
  countryCode: string | null;
  number: string | null;
  fullPhoneNumber: string | null;
}

export interface ISignupForm {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string | null;
  gender: GENDER | null;
  password: string | null;
  confirm: string | null;
  birthdayDate: Date | null;
  phoneNumber: IPhoneNumber;
}

export interface ISignupVerifyForm {
  verifyCode: string | null;
}

export interface IForgotPasswordForm {
  identifierType: FORGOT_PASSWORD_IDENTIFIER_TYPE;
  identifier: string | null;
}

export interface IResetPasswordForm {
  password: string | null;
  confirmPassword: string | null;
  resetToken: string | null;
}

export interface IGoogleLoginForm {
  idToken: string | null;
}

export interface IGoogleSignupForm {
  idToken: string | null;
  username: string | null;
  phoneNumber: IPhoneNumber;
  gender: GENDER | null;
  birthdayDate: Date | null;
}
