import type {
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

export type LoginFormType = {
  identifierType: IDENTIFIER_TYPE | null;
  identifier: string | null;
  password: string | null;
};

export type FaceIdLoginFormType = {
  identifierType: IDENTIFIER_TYPE;
  identifier: string;
  faceDescriptor: number[];
};

export type PhoneNumberType = {
  countryCode: string | null;
  number: string | null;
  fullPhoneNumber: string | null;
};

export type SignupFormType = {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string | null;
  gender: GENDER | null;
  password: string | null;
  confirm: string | null;
  birthdayDate: Date | null;
  phoneNumber: PhoneNumberType;
};

export type VerifySignupFormType = {
  code: string | null;
};

export type ForgotPasswordFormType = {
  identifierType: FORGOT_PASSWORD_IDENTIFIER_TYPE | null;
  identifier: string | null;
};

export type ResetPasswordFormType = {
  password: string | null;
  confirmPassword: string | null;
  resetToken: string | null;
};

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
