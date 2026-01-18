import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEYS, RESOURCE } from "@/common/enums/enums";
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
  IGoogleLoginForm,
  IGoogleSignupForm,
  IFaceIdForm,
  IIsValidToken,
  IRefreshResponse,
  IAuthenticateUserResponse,
  IAuthenticateUser,
  IRestoreAccountResponse,
  IRestoreAccount,
} from "../types/types";
import { t } from "i18next";
import { ApiErrorType } from "@/common/types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import axios from "@/common/helpers/instance";
import {
  deleteAccount,
  logout,
} from "@/modules/settings/AccountSettings/api/api";
import { authTokenManager } from "@/common/helpers/authToken.manager";

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
  LOADING_RESTORE_ACCOUNT: boolean;

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
  ERROR_RESTORE_ACCOUNT: ApiErrorType;
}

// ======================== LOGIN
export const login = createAsyncThunk<ILoginResponse, ILoginForm>(
  API_ENDPOINTS.AUTH.LOGIN,
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post<ILoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

// ======================== SIGNUP
export const signup = createAsyncThunk<
  ISignupResponse,
  Omit<ISignupForm, "confirm">
>(API_ENDPOINTS.AUTH.SIGNUP, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post<ISignupResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || t("error_messages.process_failed")
    );
  }
});

// ======================== VERIFY SIGNUP
export const signupVerify = createAsyncThunk<
  ISignupVerifyResponse,
  ISignupVerifyForm
>(API_ENDPOINTS.AUTH.SIGNUP_VERIFY, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post<ISignupVerifyResponse>(
      API_ENDPOINTS.AUTH.SIGNUP_VERIFY,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || t("error_messages.process_failed")
    );
  }
});

// ======================== FORGOT PASSWORD
export const forgotPassword = createAsyncThunk<
  IForgotPasswordResponse,
  IForgotPasswordForm
>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post<IForgotPasswordResponse>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || t("error_messages.process_failed")
    );
  }
});

// ======================== RESET PASSWORD
export const resetPassword = createAsyncThunk<
  IResetPasswordResponse,
  IResetPasswordForm
>(API_ENDPOINTS.AUTH.RESET_PASSWORD, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post<IResetPasswordResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || t("error_messages.process_failed")
    );
  }
});

// ======================== GOOGLE LOGIN
export const googleLogin = createAsyncThunk<ILoginResponse, IGoogleLoginForm>(
  API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post<ILoginResponse>(
        API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
        data
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

// ======================== GOOGLE SIGNUP
export const googleSignup = createAsyncThunk<
  ISignupVerifyResponse,
  IGoogleSignupForm
>(API_ENDPOINTS.AUTH.GOOGLE_SIGNUP, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post<ISignupVerifyResponse>(
      API_ENDPOINTS.AUTH.GOOGLE_SIGNUP,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || t("error_messages.process_failed")
    );
  }
});

// ======================== FACE ID
export const faceId = createAsyncThunk<ILoginResponse, IFaceIdForm>(
  API_ENDPOINTS.AUTH.FACE_DESCRIPTOR,
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post<ILoginResponse>(
        API_ENDPOINTS.AUTH.FACE_DESCRIPTOR,
        data
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

// ======================== VALIDATE TOKEN
export const isValidToken = createAsyncThunk<boolean, IIsValidToken>(
  API_ENDPOINTS.AUTH.IS_VALID_TOKEN,
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post<boolean>(
        API_ENDPOINTS.AUTH.IS_VALID_TOKEN,
        data
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

// ======================== REFRESH
export const refresh = createAsyncThunk<IRefreshResponse>(
  API_ENDPOINTS.AUTH.REFRESH,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post<IRefreshResponse>(
        API_ENDPOINTS.AUTH.REFRESH
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

// ======================== AUTHENTICATE USER
export const authenticateUser = createAsyncThunk<
  IAuthenticateUserResponse,
  IAuthenticateUser
>(API_ENDPOINTS.AUTH.AUTHENTICATE_USER, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post<IAuthenticateUserResponse>(
      API_ENDPOINTS.AUTH.AUTHENTICATE_USER,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data.message || t("error_messages.process_failed")
    );
  }
});

// ======================== RESTORE ACCOUNT
export const restoreAccount = createAsyncThunk<
  IRestoreAccountResponse,
  IRestoreAccount
>(API_ENDPOINTS.AUTH.RESTORE_ACCOUNT, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post<IRestoreAccountResponse>(
      API_ENDPOINTS.AUTH.RESTORE_ACCOUNT,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data.message || t("error_messages.process_failed")
    );
  }
});

const initialState: AuthState = {
  access_token: authTokenManager.getToken(),
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
  LOADING_RESTORE_ACCOUNT: false,

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
  ERROR_RESTORE_ACCOUNT: null,
};

const authSlice = createSlice({
  name: RESOURCE.AUTH,
  initialState,
  reducers: {
    setlogout(state) {
      state.access_token = null;
      authTokenManager.clear()
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.access_token = action.payload;
      authTokenManager.setToken(action.payload);
    },
    setAuthForm: (state, action: PayloadAction<AuthFormType>) => {
      state.authForm = action.payload;
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_PAGE, action.payload);
    },
    setLoginMode: (state, action: PayloadAction<LoginModeType>) => {
      state.loginMode = action.payload;
      localStorage.setItem(LOCAL_STORAGE_KEYS.LOGIN_MODE, action.payload);
    },
    setSignupForm: (state, action: PayloadAction<ISignupForm | null>) => {
      state.signupForm = action.payload;
    },
    setForgotPasswordMode: (
      state,
      action: PayloadAction<ForgotPasswordModeType>
    ) => {
      state.forgotPasswordMode = action.payload;
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FORGOT_PASSWORD_MODE,
        action.payload
      );
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
        | "restoreAccount"
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
        case "restoreAccount":
          state.ERROR_RESTORE_ACCOUNT = null;
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
        authTokenManager.setToken(action.payload.access_token);
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
        authTokenManager.setToken(action.payload.access_token);
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
        authTokenManager.setToken(action.payload.access_token);
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
        authTokenManager.setToken(action.payload.access_token);
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
        state.access_token = null;
        authTokenManager.clear()
      })

      // =================== DELETE ACCOUNT
      .addCase(deleteAccount.fulfilled, (state) => {
        state.access_token = null;
        authTokenManager.clear()
      })

      // =================== RESTORE ACCOUNT
      .addCase(restoreAccount.fulfilled, (state, action) => {
        state.LOADING_RESTORE_ACCOUNT = false;
        state.access_token = action.payload.access_token;
        authTokenManager.setToken(action.payload.access_token);
      })
      .addCase(restoreAccount.pending, (state) => {
        state.LOADING_RESTORE_ACCOUNT = true;
      })
      .addCase(restoreAccount.rejected, (state, action) => {
        state.LOADING_RESTORE_ACCOUNT = false;
        state.ERROR_RESTORE_ACCOUNT = action.payload as string | string[];
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
