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
  IGoogleLoginForm,
  IGoogleSignupForm,
  IFaceIdForm,
  IIsValidToken,
  IRefreshResponse,
  IAuthenticateUserResponse,
  IAuthenticateUser,
} from "@/types/auth/auth/auth.type";
import {
  authenticateUserApi,
  faceIdApi,
  forgotPasswordApi,
  googleLoginApi,
  googleSignupApi,
  isValidTokenApi,
  loginApi,
  logoutApi,
  refreshApi,
  resetPasswordApi,
  signupApi,
  signupVerifyApi,
} from "./authAPI";
import { t } from "i18next";
import { ApiErrorType } from "@/types/api.types";

export interface AuthState {
  access_token: string | null;
  error: string | null;
  authToken: string | null;

  authForm: AuthFormType;
  loginMode: LoginModeType;
  signupForm: ISignupForm | null;
  forgotPasswordMode: ForgotPasswordModeType;

  LOADING_LOGIN: boolean;
  LOADING_SIGNUP: boolean;
  LOADING_SIGNUP_VERIFY: boolean;
  LOADING_RESET_PASSWORD: boolean;
  LOADING_FORGOT_PASSWORD: boolean;
  LOADING_GOOGLE_LOGIN: boolean;
  LOADING_GOOGLE_SIGNUP: boolean;
  LOADING_FACE_ID: boolean;
  LOADING_IS_VALID_TOKEN: boolean;
  LOADING_REFRESH: boolean;
  LOADING_AUTHENTICATE_USER: boolean;
  LOADING_LOGOUT: boolean;

  ERROR_LOGIN: ApiErrorType;
  ERROR_SIGNUP: ApiErrorType;
  ERROR_SIGNUP_VERIFY: ApiErrorType;
  ERROR_RESET_PASSWORD: ApiErrorType;
  ERROR_FORGOT_PASSWORD: ApiErrorType;
  ERROR_GOOGLE_LOGIN: ApiErrorType;
  ERROR_GOOGLE_SIGNUP: ApiErrorType;
  ERROR_FACE_ID: ApiErrorType;
  ERROR_IS_VALID_TOKEN: ApiErrorType;
  ERROR_REFRESH: ApiErrorType;
  ERROR_AUTHENTICATE_USER: ApiErrorType;
  ERROR_LOGOUT: ApiErrorType;
}

export const login = createAsyncThunk<ILoginResponse, ILoginForm>(
  "/auth/login",
  async (data: ILoginForm, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

export const signup = createAsyncThunk<
  ISignupResponse,
  Omit<ISignupForm, "confirm">
>(
  "/auth/signup",
  async (data: Omit<ISignupForm, "confirm">, { rejectWithValue }) => {
    try {
      const res = await signupApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
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
        error.response?.data?.message || t("error_messages.process_failed")
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
        error.response?.data?.message || t("error_messages.process_failed")
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
        error.response?.data?.message || t("error_messages.process_failed")
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
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

export const googleLogin = createAsyncThunk<ILoginResponse, IGoogleLoginForm>(
  "/auth/google/login",
  async (data: IGoogleLoginForm, { rejectWithValue }) => {
    try {
      const res = await googleLoginApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

export const googleSignup = createAsyncThunk<
  ISignupVerifyResponse,
  IGoogleSignupForm
>(
  "/auth/google/signup",
  async (data: IGoogleSignupForm, { rejectWithValue }) => {
    try {
      const res = await googleSignupApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

export const faceId = createAsyncThunk<ILoginResponse, IFaceIdForm>(
  "/auth/face-descriptor",
  async (data: IFaceIdForm, { rejectWithValue }) => {
    try {
      const res = await faceIdApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

export const isValidToken = createAsyncThunk<boolean, IIsValidToken>(
  "/auth/is-valid-token",
  async (data, { rejectWithValue }) => {
    try {
      const res = await isValidTokenApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

export const refresh = createAsyncThunk<IRefreshResponse>(
  "/auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await refreshApi();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

export const authenticateUser = createAsyncThunk<
  IAuthenticateUserResponse,
  IAuthenticateUser
>(
  "/auth/authenticate-user",
  async (data: IAuthenticateUser, { rejectWithValue }) => {
    try {
      const res = await authenticateUserApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || t("error_messages.process_failed")
      );
    }
  }
);

const initialState: AuthState = {
  access_token: localStorage.getItem("access_token"),
  error: null,
  authToken: null,

  authForm: "login",
  loginMode: "username",
  signupForm: null,
  forgotPasswordMode: "email",

  LOADING_LOGIN: false,
  LOADING_SIGNUP: false,
  LOADING_SIGNUP_VERIFY: false,
  LOADING_RESET_PASSWORD: false,
  LOADING_FORGOT_PASSWORD: false,
  LOADING_GOOGLE_LOGIN: false,
  LOADING_GOOGLE_SIGNUP: false,
  LOADING_FACE_ID: false,
  LOADING_IS_VALID_TOKEN: false,
  LOADING_REFRESH: false,
  LOADING_AUTHENTICATE_USER: false,
  LOADING_LOGOUT: false,

  ERROR_LOGIN: null,
  ERROR_SIGNUP: null,
  ERROR_SIGNUP_VERIFY: null,
  ERROR_RESET_PASSWORD: null,
  ERROR_FORGOT_PASSWORD: null,
  ERROR_GOOGLE_LOGIN: null,
  ERROR_GOOGLE_SIGNUP: null,
  ERROR_FACE_ID: null,
  ERROR_IS_VALID_TOKEN: null,
  ERROR_REFRESH: null,
  ERROR_AUTHENTICATE_USER: null,
  ERROR_LOGOUT: null,
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
    clearError: (
      state,
      action: PayloadAction<
        | "login"
        | "signup"
        | "verify"
        | "resetPassword"
        | "forgotPassword"
        | "authenticateUser"
      >
    ) => {
      switch (action.payload) {
        case "login":
          state.ERROR_LOGIN = null;
          state.ERROR_GOOGLE_LOGIN = null;
          break;
        case "signup":
          state.ERROR_SIGNUP = null;
          state.ERROR_GOOGLE_SIGNUP = null;
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
        case "authenticateUser":
          state.ERROR_AUTHENTICATE_USER = null;
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
        localStorage.setItem("access_token", action.payload.access_token);
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
      })

      // =================== GOOGLE LOGIN
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.LOADING_GOOGLE_LOGIN = false;
        state.access_token = action.payload.access_token;
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(googleLogin.pending, (state) => {
        state.LOADING_GOOGLE_LOGIN = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.LOADING_GOOGLE_LOGIN = false;
        state.ERROR_GOOGLE_LOGIN = action.payload as string | string[];
      })

      // =================== GOOGLE SIGNUP
      .addCase(googleSignup.fulfilled, (state, action) => {
        state.LOADING_GOOGLE_SIGNUP = false;
        state.access_token = action.payload.access_token;
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(googleSignup.pending, (state) => {
        state.LOADING_GOOGLE_SIGNUP = true;
      })
      .addCase(googleSignup.rejected, (state, action) => {
        state.LOADING_GOOGLE_SIGNUP = false;
        state.ERROR_GOOGLE_SIGNUP = action.payload as string | string[];
      })

      // =================== FACE DESCRIPTOR
      .addCase(faceId.fulfilled, (state, action) => {
        state.LOADING_FACE_ID = false;
        void action;
      })
      .addCase(faceId.pending, (state) => {
        state.LOADING_FACE_ID = true;
      })
      .addCase(faceId.rejected, (state, action) => {
        state.LOADING_FACE_ID = false;
        state.ERROR_GOOGLE_SIGNUP = action.payload as string | string[];
      })

      // =================== IS VALID TOKEN
      .addCase(isValidToken.fulfilled, (state) => {
        state.LOADING_IS_VALID_TOKEN = false;
      })
      .addCase(isValidToken.pending, (state) => {
        state.LOADING_IS_VALID_TOKEN = true;
      })
      .addCase(isValidToken.rejected, (state, action) => {
        state.LOADING_IS_VALID_TOKEN = false;
        state.ERROR_IS_VALID_TOKEN = action.payload as string | string[];
      })

      // =================== REFRESH
      .addCase(refresh.fulfilled, (state, action) => {
        state.LOADING_REFRESH = false;
        state.access_token = action.payload.access_token;
      })
      .addCase(refresh.pending, (state) => {
        state.LOADING_REFRESH = true;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.LOADING_REFRESH = false;
        state.ERROR_REFRESH = action.payload as string | string[];
      })

      // =================== REFRESH
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.LOADING_AUTHENTICATE_USER = false;
        state.authToken = action.payload.token;
      })
      .addCase(authenticateUser.pending, (state) => {
        state.LOADING_AUTHENTICATE_USER = true;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.LOADING_AUTHENTICATE_USER = false;
        state.ERROR_AUTHENTICATE_USER = action.payload as string | string[];
      })

      // =================== LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.LOADING_LOGOUT = false;
        state.access_token = null;
      })
      .addCase(logout.pending, (state) => {
        state.LOADING_LOGOUT = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.LOADING_LOGOUT = false;
        state.ERROR_LOGOUT = action.payload as string | string[];
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
