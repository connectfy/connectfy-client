import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Resource } from "../../types/enum.types";
import type {
  AuthFormType,
  ForgotPasswordFormType,
  LoginFormType,
  LoginModeType,
  ResetPasswordFormType,
  SignupFormType,
  VerifySignupFormType,
} from "../../types/auth/auth.type";

export interface AuthState {
  access_token: string | null;
  loading: boolean;
  error: string | null;

  authForm: AuthFormType;

  loginMode: LoginModeType;
  loginForm: LoginFormType;
  signupForm: SignupFormType;

  verifySignupForm: VerifySignupFormType;
  forgotPasswordForm: ForgotPasswordFormType;
  resetPasswordForm: ResetPasswordFormType;
}

const initialState: AuthState = {
  access_token: localStorage.getItem("access_token"),
  loading: false,
  error: null,

  authForm: "login",

  loginMode: "username",
  loginForm: {
    identifierType: null,
    identifier: null,
    password: null,
  },

  signupForm: {
    firstName: null,
    lastName: null,
    username: null,
    email: null,
    gender: null,
    birthdayDate: null,
    phoneNumber: {
      countryCode: null,
      number: null,
      fullPhoneNumber: null,
    },
    password: null,
    confirm: null,
  },

  verifySignupForm: {
    code: null,
  },

  forgotPasswordForm: {
    identifier: null,
    identifierType: null,
  },

  resetPasswordForm: {
    password: null,
    resetToken: null,
    confirmPassword: null,
  },
};

const authSlice = createSlice({
  name: Resource.auth,
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.access_token = action.payload;
      localStorage.setItem("access_token", action.payload);
    },
    setAuthForm: (state, action: PayloadAction<AuthFormType>) => {
      state.authForm = action.payload;
    },
    setLoginMode: (state, action: PayloadAction<LoginModeType>) => {
      state.loginMode = action.payload;
    },
    setLoginForm: (state, action: PayloadAction<Partial<LoginFormType>>) => {
      state.loginForm = { ...state.loginForm, ...action.payload };
    },

    setSignupForm: (state, action: PayloadAction<Partial<SignupFormType>>) => {
      state.signupForm = { ...state.signupForm, ...action.payload };
    },
    setVerifySignupForm: (
      state,
      action: PayloadAction<VerifySignupFormType>
    ) => {
      state.verifySignupForm = action.payload;
    },
    setForgotPassword: (
      state,
      action: PayloadAction<Partial<ForgotPasswordFormType>>
    ) => {
      state.forgotPasswordForm = {
        ...state.forgotPasswordForm,
        ...action.payload,
      };
    },
    setRefetPasswordForm: (
      state,
      action: PayloadAction<Partial<ForgotPasswordFormType>>
    ) => {
      state.forgotPasswordForm = {
        ...state.forgotPasswordForm,
        ...action.payload,
      };
    },
  },
});

export const {
  setAccessToken,
  setAuthForm,
  setLoginMode,
  setLoginForm,
  setSignupForm,
  setVerifySignupForm,
  setForgotPassword,
  setRefetPasswordForm,
} = authSlice.actions;
export default authSlice.reducer;
