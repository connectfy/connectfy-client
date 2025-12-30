import { RESOURCE } from "@/common/enums/enums";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import axios from "@/common/helpers/instance";
import {
  IDeactivateAccount,
  IDeactivateAccountResponse,
  IDeleteAccount,
  IDeleteAccountResponse,
  ILogoutResponse,
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
} from "../types/types";
import { ApiErrorType } from "@/common/types/types";

export interface AccounSettingsState {
  LOADING_UPDATE_USERNAME: boolean;
  LOADING_UPDATE_EMAIL: boolean;
  LOADING_UPDATE_PASSWORD: boolean;
  LOADING_VERIFY_CHANGE_EMAIL: boolean;
  LOADING_UPDATE_PHONE_NUMBER: boolean;
  LOADING_LOGOUT: boolean;
  LOADING_DELETE_ACCOUNT: boolean;
  LOADING_DEACTIVATE_ACCOUNT: boolean;

  ERROR_UPDATE_USERNAME: ApiErrorType;
  ERROR_UPDATE_EMAIL: ApiErrorType;
  ERROR_UPDATE_PASSWORD: ApiErrorType;
  ERROR_VERIFY_CHANGE_EMAIL: ApiErrorType;
  ERROR_UPDATE_PHONE_NUMBER: ApiErrorType;
  ERROR_LOGOUT: ApiErrorType;
  ERROR_DELETE_ACCOUNT: ApiErrorType;
  ERROR_DEACTIVATE_ACCOUNT: ApiErrorType;
}

// ================== UPDATE USERNAME
export const updateUsername = createAsyncThunk<
  IUpdateUsernameResponse,
  IUpdateUsername
>(API_ENDPOINTS.USER.CHANGE_USERNAME, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.patch<IUpdateUsernameResponse>(
      API_ENDPOINTS.USER.CHANGE_USERNAME,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || t("error_messages.process_failed")
    );
  }
});

// ================== UPDATE EMAIL
export const updateEmail = createAsyncThunk<IUpdateEmailResponse, IUpdateEmail>(
  API_ENDPOINTS.USER.CHANGE_EMAIL,
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.patch<IUpdateEmailResponse>(
        API_ENDPOINTS.USER.CHANGE_EMAIL,
        data
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

// ================== UPDATE PASSWORD
export const updatePassword = createAsyncThunk<
  IUpdatePasswordResponse,
  IUpdatePassword
>(API_ENDPOINTS.USER.CHANGE_PASSWORD, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.patch<IUpdatePasswordResponse>(
      API_ENDPOINTS.USER.CHANGE_PASSWORD,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || t("error_messages.process_failed")
    );
  }
});

// ================== VERIFY CHANGE EMAIL
export const verifyChangeEmail = createAsyncThunk<
  IVerifyChangeEmailResponse,
  IVerifyChangeEmail
>(API_ENDPOINTS.USER.VERIFY_CHANGE_EMAIL, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.patch<IVerifyChangeEmailResponse>(
      API_ENDPOINTS.USER.VERIFY_CHANGE_EMAIL,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || t("error_messages.process_failed")
    );
  }
});

// ================== UPDATE PHONE NUMBER
export const updatePhoneNumber = createAsyncThunk<
  IUpdatePhoneNumberResponse,
  IUpdatePhoneNumber
>(API_ENDPOINTS.USER.CHANGE_PHONE_NUMBER, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.patch<IUpdatePhoneNumberResponse>(
      API_ENDPOINTS.USER.CHANGE_PHONE_NUMBER,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || t("error_messages.process_failed")
    );
  }
});

// ======================== LOGOUT
export const logout = createAsyncThunk<ILogoutResponse>(
  API_ENDPOINTS.AUTH.LOGOUT,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post<ILogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

// ======================== DELETE ACCOUNT
export const deleteAccount = createAsyncThunk<
  IDeleteAccountResponse,
  IDeleteAccount
>(API_ENDPOINTS.AUTH.DELETE_ACCOUNT, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post<IDeleteAccountResponse>(
      API_ENDPOINTS.AUTH.DELETE_ACCOUNT,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data.message || t("error_messages.process_failed")
    );
  }
});

// ======================== DEACTIVATE ACCOUNT
export const deactivateAccount = createAsyncThunk<
  IDeactivateAccountResponse,
  IDeactivateAccount
>(API_ENDPOINTS.AUTH.DEACTIVATE_ACCOUNT, async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post<IDeactivateAccountResponse>(
      API_ENDPOINTS.AUTH.DEACTIVATE_ACCOUNT,
      data
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data.message || t("error_messages.process_failed")
    );
  }
});

const initialState: AccounSettingsState = {
  LOADING_UPDATE_USERNAME: false,
  LOADING_UPDATE_EMAIL: false,
  LOADING_UPDATE_PASSWORD: false,
  LOADING_VERIFY_CHANGE_EMAIL: false,
  LOADING_UPDATE_PHONE_NUMBER: false,
  LOADING_LOGOUT: false,
  LOADING_DELETE_ACCOUNT: false,
  LOADING_DEACTIVATE_ACCOUNT: false,

  ERROR_UPDATE_USERNAME: null,
  ERROR_UPDATE_EMAIL: null,
  ERROR_UPDATE_PASSWORD: null,
  ERROR_VERIFY_CHANGE_EMAIL: null,
  ERROR_UPDATE_PHONE_NUMBER: null,
  ERROR_LOGOUT: null,
  ERROR_DELETE_ACCOUNT: null,
  ERROR_DEACTIVATE_ACCOUNT: null,
};

const accountSettingsSlice = createSlice({
  name: RESOURCE.ACCOUNT_SETTINGS,
  initialState,
  reducers: {
    clearError: (
      state,
      action: PayloadAction<
        | "updateUsername"
        | "updateEmail"
        | "updatePassword"
        | "verifyChangeEmail"
        | "updatePhoneNumber"
        | "deactivateAccount"
        | "logout"
        | "deleteAccount"
      >
    ) => {
      switch (action.payload) {
        case "updateUsername":
          state.ERROR_UPDATE_USERNAME = null;
          break;
        case "updateEmail":
          state.ERROR_UPDATE_EMAIL = null;
          break;
        case "updatePassword":
          state.ERROR_UPDATE_PASSWORD = null;
          break;
        case "verifyChangeEmail":
          state.ERROR_VERIFY_CHANGE_EMAIL = null;
          break;
        case "updatePhoneNumber":
          state.ERROR_UPDATE_PHONE_NUMBER = null;
          break;
        case "deactivateAccount":
          state.ERROR_DEACTIVATE_ACCOUNT = null;
          break;
        case "deleteAccount":
          state.ERROR_DELETE_ACCOUNT = null;
          break;
        case "logout":
          state.ERROR_LOGOUT = null;
          break;
        default:
          break;
      }
    },
  },
  extraReducers: (builder) =>
    builder
      // ====================== UPDATE USERNAME
      .addCase(updateUsername.fulfilled, (state) => {
        state.LOADING_UPDATE_USERNAME = false;
        state.ERROR_UPDATE_USERNAME = null;
      })
      .addCase(updateUsername.pending, (state) => {
        state.LOADING_UPDATE_USERNAME = true;
        state.ERROR_UPDATE_USERNAME = null;
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.LOADING_UPDATE_USERNAME = false;
        state.ERROR_UPDATE_USERNAME = action.payload as string;
      })

      // ====================== UPDATE EMAIL
      .addCase(updateEmail.fulfilled, (state) => {
        state.LOADING_UPDATE_EMAIL = false;
        state.ERROR_UPDATE_EMAIL = null;
      })
      .addCase(updateEmail.pending, (state) => {
        state.LOADING_UPDATE_EMAIL = true;
        state.ERROR_UPDATE_EMAIL = null;
      })
      .addCase(updateEmail.rejected, (state, action) => {
        state.LOADING_UPDATE_EMAIL = false;
        state.ERROR_UPDATE_EMAIL = action.payload as string;
      })

      // ====================== UPDATE PASSWORD
      .addCase(updatePassword.fulfilled, (state) => {
        state.LOADING_UPDATE_PASSWORD = false;
        state.ERROR_UPDATE_PASSWORD = null;
      })
      .addCase(updatePassword.pending, (state) => {
        state.LOADING_UPDATE_PASSWORD = true;
        state.ERROR_UPDATE_PASSWORD = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.LOADING_UPDATE_PASSWORD = false;
        state.ERROR_UPDATE_PASSWORD = action.payload as string;
      })

      // ====================== VERIFY CHANGE EMAIL
      .addCase(verifyChangeEmail.fulfilled, (state) => {
        state.LOADING_VERIFY_CHANGE_EMAIL = false;
        state.ERROR_VERIFY_CHANGE_EMAIL = null;
      })
      .addCase(verifyChangeEmail.pending, (state) => {
        state.LOADING_VERIFY_CHANGE_EMAIL = true;
        state.ERROR_VERIFY_CHANGE_EMAIL = null;
      })
      .addCase(verifyChangeEmail.rejected, (state, action) => {
        state.LOADING_VERIFY_CHANGE_EMAIL = false;
        state.ERROR_VERIFY_CHANGE_EMAIL = action.payload as string;
      })

      // ================== UPDATE PHONE NUMBER
      .addCase(updatePhoneNumber.fulfilled, (state) => {
        state.LOADING_UPDATE_PHONE_NUMBER = false;
        state.ERROR_UPDATE_PHONE_NUMBER = null;
      })
      .addCase(updatePhoneNumber.pending, (state) => {
        state.LOADING_UPDATE_PHONE_NUMBER = true;
        state.ERROR_UPDATE_PHONE_NUMBER = null;
      })
      .addCase(updatePhoneNumber.rejected, (state, action) => {
        state.LOADING_UPDATE_PHONE_NUMBER = false;
        state.ERROR_UPDATE_PHONE_NUMBER = action.payload as string;
      })

      // =================== LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.LOADING_LOGOUT = false;
      })
      .addCase(logout.pending, (state) => {
        state.LOADING_LOGOUT = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.LOADING_LOGOUT = false;
        state.ERROR_LOGOUT = action.payload as string | string[];
      })


      // =================== DELETE ACCOUNT
      .addCase(deleteAccount.fulfilled, (state) => {
        state.LOADING_DELETE_ACCOUNT = false;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.LOADING_DELETE_ACCOUNT = true;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.LOADING_DELETE_ACCOUNT = false;
        state.ERROR_DELETE_ACCOUNT = action.payload as string | string[];
      })

      // =================== DEACTIVATE ACCOUNT
      .addCase(deactivateAccount.fulfilled, (state) => {
        state.LOADING_DEACTIVATE_ACCOUNT = false;
        localStorage.removeItem("access_token");
      })
      .addCase(deactivateAccount.pending, (state) => {
        state.LOADING_DEACTIVATE_ACCOUNT = true;
      })
      .addCase(deactivateAccount.rejected, (state, action) => {
        state.LOADING_DEACTIVATE_ACCOUNT = false;
        state.ERROR_DEACTIVATE_ACCOUNT = action.payload as string | string[];
      })
});

export const { clearError } = accountSettingsSlice.actions;
export default accountSettingsSlice.reducer;
