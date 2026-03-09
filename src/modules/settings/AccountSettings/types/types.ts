import {
  DELETE_REASON_CODE,
  PHONE_NUMBER_ACTION,
  TWO_FACTOR_ACTION,
} from "@/common/enums/enums";
import { IPhoneNumber } from "@/modules/auth/types/types";
import { IUser } from "@/modules/profile/types/types";

export type ChangeModalKey =
  | "username"
  | "email"
  | "password"
  | "phone_number"
  | "delete_account"
  | "deactivate_account"
  | "two_factor"
  | null;

export interface IUpdateUsername {
  username: string | null;
  token: string | null;
}

export interface IUpdateEmail {
  email: string | null;
  token: string | null;
}

export interface IUpdatePassword {
  password: string | null;
  confirmPassword: string | null;
  token: string | null;
}

export interface IVerifyChangeEmail {
  token: string | null;
}

export interface IUpdatePhoneNumber {
  token: string | null;
  action: PHONE_NUMBER_ACTION | null;
  phoneNumber: IPhoneNumber | null;
}

export interface IUpdateUsernameResponse extends IUser {}

export interface IUpdateEmailResponse {
  statusCode: number;
}

export interface IUpdatePasswordResponse extends IUser {}

export interface IVerifyChangeEmailResponse extends IUser {}

export interface IUpdatePhoneNumberResponse extends IUser {}

export interface IResetPasswordResponse {
  statusCode: number;
}

export interface ILogoutResponse {
  statusCode: number;
}

export interface IDeleteAccount {
  token: string | null;
  reasonCode: DELETE_REASON_CODE | null;
  reasonDescription: string | null;
}

export interface IDeleteAccountResponse {
  statusCode: number;
}

export interface IDeactivateAccount {
  token: string | null;
}

export interface IDeactivateAccountResponse {
  statusCode: number;
}

export interface IUpdateTwoFactor {
  token: string | null;
  action: TWO_FACTOR_ACTION;
}

export interface IUpdateTwoFactorResponse extends IUser {}
