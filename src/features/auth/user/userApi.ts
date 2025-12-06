import {
  IMe,
  IUpdateEmail,
  IUpdateEmailResponse,
  IUpdatePassword,
  IUpdatePasswordResponse,
  IUpdatePhoneNumber,
  IUpdatePhoneNumberResponse,
  IUpdateUsername,
  IUpdateUsernameResponse,
  IVerifyChangeEmail,
  IVerifyChangeEmailResponse,
} from "@/types/auth/user/user.type";
import axios from "@/helpers/instance";

export const meApi = () => axios.post<IMe>("/user/me", {});

export const updateUsernameApi = (data: IUpdateUsername) =>
  axios.patch<IUpdateUsernameResponse>("/user/change-username", data);

export const updateEmailApi = (data: IUpdateEmail) =>
  axios.patch<IUpdateEmailResponse>("/user/change-email", data);

export const updatePasswordApi = (data: IUpdatePassword) =>
  axios.patch<IUpdatePasswordResponse>("/user/change-password", data);

export const verifyChangeEmailApi = (data: IVerifyChangeEmail) =>
  axios.patch<IVerifyChangeEmailResponse>("/user/change-email/verify", data);

export const updatePhoneNumberApi = (data: IUpdatePhoneNumber) =>
  axios.patch<IUpdatePhoneNumberResponse>("/user/change-phone-number", data);
