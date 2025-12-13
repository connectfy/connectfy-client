import {
  IForgotPasswordForm,
  IForgotPasswordResponse,
  ILoginResponse,
  ISignupResponse,
  ISignupVerifyResponse,
  ILoginForm,
  ISignupForm,
  ISignupVerifyForm,
  IResetPasswordForm,
  IResetPasswordResponse,
  ILogoutResponse,
  IGoogleLoginForm,
  IGoogleSignupForm,
  IFaceIdForm,
  IIsValidToken,
  IRefreshResponse,
  IAuthenticateUserResponse,
  IAuthenticateUser,
  IDeleteAccount,
  IDeleteAccountResponse,
  IRestoreAccount,
  IRestoreAccountResponse,
  IDeactivateAccount,
  IDeactivateAccountResponse,
} from "@/types/auth/auth/auth.type";
import axios from "@/helpers/instance";

export const loginApi = (data: ILoginForm) =>
  axios.post<ILoginResponse>("/auth/login", data);

export const signupApi = (data: Omit<ISignupForm, "confirm">) =>
  axios.post<ISignupResponse>("/auth/signup", data);

export const signupVerifyApi = (data: ISignupVerifyForm) =>
  axios.post<ISignupVerifyResponse>("/auth/signup/verify", data);

export const forgotPasswordApi = (data: IForgotPasswordForm) =>
  axios.post<IForgotPasswordResponse>("/auth/forgot-password", data);

export const resetPasswordApi = (data: IResetPasswordForm) =>
  axios.post<IResetPasswordResponse>("/auth/reset-password", data);

export const logoutApi = () => axios.post<ILogoutResponse>("/auth/logout");

export const googleLoginApi = (data: IGoogleLoginForm) =>
  axios.post<ILoginResponse>("/auth/google/login", data);

export const googleSignupApi = (data: IGoogleSignupForm) =>
  axios.post<ISignupVerifyResponse>("/auth/google/signup", data);

export const faceIdApi = (data: IFaceIdForm) =>
  axios.post<ILoginResponse>("/auth/face-descriptor", data);

export const isValidTokenApi = (data: IIsValidToken) =>
  axios.post<boolean>("/auth/is-valid-token", data);

export const refreshApi = () =>
  axios.post<IRefreshResponse>("/auth/refresh", {});

export const authenticateUserApi = (data: IAuthenticateUser) =>
  axios.post<IAuthenticateUserResponse>("/auth/authenticate-user", data);

export const deleteAccountApi = (data: IDeleteAccount) =>
  axios.post<IDeleteAccountResponse>("/auth/delete-account", data);

export const restoreAccountApi = (data: IRestoreAccount) =>
  axios.post<IRestoreAccountResponse>("/auth/restore-account", data);

export const deactivateAccountApi = (data: IDeactivateAccount) =>
  axios.post<IDeactivateAccountResponse>("/auth/deactivate-account", data);
