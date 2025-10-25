import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Resource } from "@/types/enum.types";
import {
  AuthFormType,
  LoginModeType,
  ForgotPasswordModeType,
  IForgotPasswordForm,
  ILoginResponse,
  ISignupResponse,
  ILoginForm,
  IResetPasswordForm,
  ISignupForm,
  IForgotPasswordResponse,
  ISignupVerifyResponse,
  ISignupVerifyForm,
  IResetPasswordResponse,
  ILogoutResponse,
} from "@/types/auth/auth.type";
import {
  forgotPasswordApi,
  loginApi,
  logoutApi,
  resetPasswordApi,
  signupApi,
  signupVerifyApi,
} from "./authAPI";
import { t } from "i18next";
import { ApiErrorType } from "@/types/api.types";

export interface AuthState {
  access_token: string | null;
  error: string | null;

  authForm: AuthFormType;
  loginMode: LoginModeType;
  signupForm: ISignupForm | null;
  forgotPasswordMode: ForgotPasswordModeType;

  LOADING_LOGIN: boolean;
  LOADING_SIGNUP: boolean;
  LOADING_SIGNUP_VERIFY: boolean;
  LOADING_RESET_PASSWORD: boolean;
  LOADING_FORGOT_PASSWORD: boolean;

  ERROR_LOGIN: ApiErrorType;
  ERROR_SIGNUP: ApiErrorType;
  ERROR_SIGNUP_VERIFY: ApiErrorType;
  ERROR_RESET_PASSWORD: ApiErrorType;
  ERROR_FORGOT_PASSWORD: ApiErrorType;
}

export const login = createAsyncThunk<ILoginResponse, ILoginForm>(
  "/auth/login",
  async (data: ILoginForm, { rejectWithValue }) => {
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

export const signup = createAsyncThunk<ISignupResponse, Omit<ISignupForm, "confirm">>(
  "/auth/signup",
  async (data: Omit<ISignupForm, "confirm">, { rejectWithValue }) => {
    try {
      const res = await signupApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_message.falied_to_signup")
      );
    }
  }
);

export const signupVerify = createAsyncThunk<
  ISignupVerifyResponse,
  ISignupVerifyForm
>(
  "/auth/signup/verify",
  async (values: ISignupVerifyForm, { rejectWithValue }) => {
    try {
      const res = await signupVerifyApi(values);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          t("error_message.falied_to_verify_signup")
      );
    }
  }
);

export const forgotPassword = createAsyncThunk<
  IForgotPasswordResponse,
  IForgotPasswordForm
>(
  "/api/forgot-password",
  async (data: IForgotPasswordForm, { rejectWithValue }) => {
    try {
      const res = await forgotPasswordApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          t("error_message.falied_to_forgot_password_request")
      );
    }
  }
);

export const resetPassword = createAsyncThunk<
  IResetPasswordResponse,
  IResetPasswordForm
>(
  "/auth/reset-password",
  async (data: IResetPasswordForm, { rejectWithValue }) => {
    try {
      const res = await resetPasswordApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          t("error_message.falied_to_reset_password")
      );
    }
  }
);

export const logout = createAsyncThunk<ILogoutResponse>(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await logoutApi();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_message.falied_to_logout")
      );
    }
  }
);

const initialState: AuthState = {
  access_token: localStorage.getItem("access_token"),
  error: null,

  authForm: "login",
  loginMode: "username",
  signupForm: null,
  forgotPasswordMode: "email",

  LOADING_LOGIN: false,
  LOADING_SIGNUP: false,
  LOADING_SIGNUP_VERIFY: false,
  LOADING_RESET_PASSWORD: false,
  LOADING_FORGOT_PASSWORD: false,

  ERROR_LOGIN: null,
  ERROR_SIGNUP: null,
  ERROR_SIGNUP_VERIFY: null,
  ERROR_RESET_PASSWORD: null,
  ERROR_FORGOT_PASSWORD: null,
};

const authSlice = createSlice({
  name: Resource.auth,
  initialState,
  reducers: {
    setlogout(state) {
      state.access_token = null;
      localStorage.removeItem("access_token");
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.access_token = action.payload;
      localStorage.setItem("access_token", action.payload);
    },
    setAuthForm: (state, action: PayloadAction<AuthFormType>) => {
      state.authForm = action.payload;
      localStorage.setItem("authPage", action.payload);
    },
    setLoginMode: (state, action: PayloadAction<LoginModeType>) => {
      state.loginMode = action.payload;
      localStorage.setItem("loginMode", action.payload);
    },
    setSignupForm: (state, action: PayloadAction<ISignupForm | null>) => {
      state.signupForm = action.payload;
    },
    setForgotPasswordMode: (
      state,
      action: PayloadAction<ForgotPasswordModeType>
    ) => {
      state.forgotPasswordMode = action.payload;
      localStorage.setItem("forgotPasswordMode", action.payload);
    },
    clearError: (state, action: PayloadAction<AuthFormType>) => {
      switch (action.payload) {
        case "login":
          state.ERROR_LOGIN = null;
          break;
        case "signup":
          state.ERROR_SIGNUP = null;
          break;
        case "verify":
          state.ERROR_SIGNUP_VERIFY = null;
          break;
        case "resetPassword":
          state.ERROR_RESET_PASSWORD = null;
          break;
        case "forgotPassword":
          state.ERROR_FORGOT_PASSWORD = null;
          break;
        default:
          break;
      }
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
        state.ERROR_LOGIN = action.payload as string | string[];
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
        state.ERROR_SIGNUP = action.payload as string | string[];
      })

      // =================== SIGNUP VERIFY
      .addCase(signupVerify.fulfilled, (state, action) => {
        state.LOADING_SIGNUP_VERIFY = false;
        state.access_token = action.payload.access_token;
      })
      .addCase(signupVerify.pending, (state) => {
        state.LOADING_SIGNUP_VERIFY = true;
      })
      .addCase(signupVerify.rejected, (state, action) => {
        state.LOADING_SIGNUP_VERIFY = false;
        state.ERROR_SIGNUP_VERIFY = action.payload as string | string[];
      })

      // =================== FORGOT PASSWORD
      .addCase(forgotPassword.fulfilled, (state) => {
        state.LOADING_FORGOT_PASSWORD = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.LOADING_FORGOT_PASSWORD = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.LOADING_FORGOT_PASSWORD = false;
        state.ERROR_FORGOT_PASSWORD = action.payload as string | string[];
      })

      // =================== RESET PASSWORD
      .addCase(resetPassword.fulfilled, (state) => {
        state.LOADING_RESET_PASSWORD = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.LOADING_RESET_PASSWORD = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.LOADING_RESET_PASSWORD = false;
        state.ERROR_RESET_PASSWORD = action.payload as string | string[];
      });
  },
});

export const {
  setlogout,
  setAccessToken,
  setAuthForm,
  setLoginMode,
  setSignupForm,
  setForgotPasswordMode,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;
