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
