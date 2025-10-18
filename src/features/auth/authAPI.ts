import type {
  ForgotPasswordFormType,
  IForgotPasswordResponse,
  ILoginResponse,
  ISignupResponse,
  ISignupVerifyResponse,
  LoginFormType,
  SignupFormType,
  VerifySignupFormType,
} from "@/types/auth/auth.type";
import axios from "@helpers/instance";

export const loginApi = (data: LoginFormType) =>
  axios.post<ILoginResponse>("/auth/login", data);

export const signupApi = (data: SignupFormType) =>
  axios.post<ISignupResponse>("/auth/signup", data);

export const signupVerifyApi = (data: VerifySignupFormType) =>
  axios.post<ISignupVerifyResponse>("/auth/signup/verify", data);

export const forgotPasswordApi = (data: ForgotPasswordFormType) =>
  axios.post<IForgotPasswordResponse>("/api/forgot-password", data);
