import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { Resource } from "../../types/enum.types";
import type {
  AuthFormType,
  ForgotPasswordFormType,
  ForgotPasswordModeType,
  ILoginResponse,
  ISignupResponse,
  LoginFormType,
  LoginModeType,
  ResetPasswordFormType,
  SignupFormType,
  VerifySignupFormType,
} from "../../types/auth/auth.type";
import { loginApi, signupApi } from "./authAPI";
import { t } from "i18next";

export interface AuthState {
  access_token: string | null;
  error: string | null;

  authForm: AuthFormType;

  loginMode: LoginModeType;
  loginForm: LoginFormType;
  signupForm: SignupFormType;

  verifySignupForm: VerifySignupFormType;

  forgotPasswordMode: ForgotPasswordModeType;
  forgotPasswordForm: ForgotPasswordFormType;

  resetPasswordForm: ResetPasswordFormType;

  LOADING_LOGIN: boolean;
  LOADING_SIGNUP: boolean;
  LOADING_FORGOT_PASSWORD: boolean;
  LOADING_SIGNUP_VERIFY: boolean;

  ERROR_LOGIN: string | null;
  ERROR_SIGNUP: string | null;
  ERROR_FORGOT_PASSWORD: string | null;
  ERROR_SIGNUP_VERIFY: string | null;
}

export const login = createAsyncThunk<ILoginResponse, LoginFormType>(
  "/auth/login",
  async (data: LoginFormType, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_message.falied_to_login")
      );
    }
  }
);

export const signup = createAsyncThunk<ISignupResponse, SignupFormType>(
  "/auth/signup",
  async (data: SignupFormType, { rejectWithValue }) => {
    try {
      const res = await signupApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_message.falied_to_login")
      );
    }
  }
);

const initialState: AuthState = {
  access_token: localStorage.getItem("access_token"),
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

  forgotPasswordMode: "email",
  forgotPasswordForm: {
    identifier: null,
    identifierType: null,
  },

  resetPasswordForm: {
    password: null,
    resetToken: null,
    confirmPassword: null,
  },

  LOADING_LOGIN: false,
  LOADING_SIGNUP: false,
  LOADING_SIGNUP_VERIFY: false,
  LOADING_FORGOT_PASSWORD: false,

  ERROR_LOGIN: null,
  ERROR_SIGNUP: null,
  ERROR_SIGNUP_VERIFY: null,
  ERROR_FORGOT_PASSWORD: null,
};

const authSlice = createSlice({
  name: Resource.auth,
  initialState,
  reducers: {
    logout(state) {
      state.access_token = null;
      localStorage.removeItem("access_token");
    },
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
    setForgotPasswordMode: (
      state,
      action: PayloadAction<ForgotPasswordModeType>
    ) => {
      state.forgotPasswordMode = action.payload;
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
  extraReducers: (builder) => {
    builder
      // =================== LOGIN
      .addCase(login.fulfilled, (state, action) => {
        state.LOADING_LOGIN = false;
        state.access_token = action.payload.access_token;
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(login.pending, (state) => {
        state.LOADING_LOGIN = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.LOADING_LOGIN = false;
        state.ERROR_LOGIN = action.payload as string;
      })

      // =================== SIGNUP
      .addCase(signup.fulfilled, (state) => {
        state.LOADING_SIGNUP = false;
      })
      .addCase(signup.pending, (state) => {
        state.LOADING_SIGNUP = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.LOADING_SIGNUP = false;
        state.ERROR_SIGNUP = action.payload as string;
      })
  },
});

export const {
  logout,
  setAccessToken,
  setAuthForm,
  setLoginMode,
  setLoginForm,
  setSignupForm,
  setVerifySignupForm,
  setForgotPasswordMode,
  setForgotPassword,
  setRefetPasswordForm,
} = authSlice.actions;
export default authSlice.reducer;
