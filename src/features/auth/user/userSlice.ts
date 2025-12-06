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
import { Resource } from "@/types/enum.types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  meApi,
  updateEmailApi,
  updatePasswordApi,
  updatePhoneNumberApi,
  updateUsernameApi,
  verifyChangeEmailApi,
} from "./userApi";
import { ApiErrorType } from "@/types/api.types";
import { t } from "i18next";
import { resetSettings } from "@/features/account/settings/general/generalSettingsSlice";

export interface UserState {
  me: IMe | null;

  LOADING_ME: boolean;
  LOADING_UPDATE_USERNAME: boolean;
  LOADING_UPDATE_EMAIL: boolean;
  LOADING_UPDATE_PASSWORD: boolean;
  LOADING_VERIFY_CHANGE_EMAIL: boolean;
  LOADING_UPDATE_PHONE_NUMBER: boolean;

  ERROR_ME: ApiErrorType;
  ERROR_UPDATE_USERNAME: ApiErrorType;
  ERROR_UPDATE_EMAIL: ApiErrorType;
  ERROR_UPDATE_PASSWORD: ApiErrorType;
  ERROR_VERIFY_CHANGE_EMAIL: ApiErrorType;
  ERROR_UPDATE_PHONE_NUMBER: ApiErrorType;
}

// ================== ME
export const me = createAsyncThunk<IMe>(
  "/user/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await meApi();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

// ================== UPDATE USERNAME
export const updateUsername = createAsyncThunk<
  IUpdateUsernameResponse,
  IUpdateUsername
>(
  "/user/change-username",
  async (data: IUpdateUsername, { rejectWithValue }) => {
    try {
      const res = await updateUsernameApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

// ================== UPDATE EMAIL
export const updateEmail = createAsyncThunk<IUpdateEmailResponse, IUpdateEmail>(
  "/user/change-email",
  async (data: IUpdateEmail, { rejectWithValue }) => {
    try {
      const res = await updateEmailApi(data);
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
>(
  "/user/change-password",
  async (data: IUpdatePassword, { rejectWithValue }) => {
    try {
      const res = await updatePasswordApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

// ================== VERIFY CHANGE EMAIL
export const verifyChangeEmail = createAsyncThunk<
  IVerifyChangeEmailResponse,
  IVerifyChangeEmail
>(
  "/user/change-email/verify",
  async (data: IVerifyChangeEmail, { rejectWithValue }) => {
    try {
      const res = await verifyChangeEmailApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

// ================== UPDATE PHONE NUMBER
export const updatePhoneNumber = createAsyncThunk<
  IUpdatePhoneNumberResponse,
  IUpdatePhoneNumber
>(
  "/user/change-phone-number",
  async (data: IUpdatePhoneNumber, { rejectWithValue }) => {
    try {
      const res = await updatePhoneNumberApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

const initialState: UserState = {
  me: null,

  LOADING_ME: false,
  LOADING_UPDATE_USERNAME: false,
  LOADING_UPDATE_EMAIL: false,
  LOADING_UPDATE_PASSWORD: false,
  LOADING_VERIFY_CHANGE_EMAIL: false,
  LOADING_UPDATE_PHONE_NUMBER: false,

  ERROR_ME: null,
  ERROR_UPDATE_USERNAME: null,
  ERROR_UPDATE_EMAIL: null,
  ERROR_UPDATE_PASSWORD: null,
  ERROR_VERIFY_CHANGE_EMAIL: null,
  ERROR_UPDATE_PHONE_NUMBER: null,
};

const userSlice = createSlice({
  name: Resource.user,
  initialState,
  reducers: {
    clearError: (
      state,
      action: PayloadAction<
        | "me"
        | "updateUsername"
        | "updateEmail"
        | "updatePassword"
        | "verifyChangeEmail"
        | "updatePhoneNumber"
      >
    ) => {
      switch (action.payload) {
        case "me":
          state.ERROR_ME = null;
          break;
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
        default:
          break;
      }
    },
    updateMe: (state, action: PayloadAction<Partial<IMe>>) => {
      state.me = { ...state.me, ...(action.payload as IMe) };
    },
  },
  extraReducers: (builder) =>
    builder
      // ====================== ME
      .addCase(me.fulfilled, (state, action) => {
        state.LOADING_ME = false;
        state.me = action.payload;
        state.ERROR_ME = null;
      })
      .addCase(me.pending, (state) => {
        state.LOADING_ME = true;
        state.ERROR_ME = null;
      })
      .addCase(me.rejected, (state, action) => {
        state.LOADING_ME = false;
        state.ERROR_ME = action.payload as string;
      })

      // ====================== UPDATE USERNAME
      .addCase(updateUsername.fulfilled, (state, action) => {
        state.LOADING_UPDATE_USERNAME = false;
        state.me!.user.username = action.payload.username;
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
      .addCase(verifyChangeEmail.fulfilled, (state, action) => {
        state.LOADING_VERIFY_CHANGE_EMAIL = false;
        state.ERROR_VERIFY_CHANGE_EMAIL = null;
        state.me!.user.email = action.payload.email;
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
      .addCase(updatePhoneNumber.fulfilled, (state, action) => {
        state.LOADING_UPDATE_PHONE_NUMBER = false;
        state.me!.user.phoneNumber = action.payload.phoneNumber;
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

      // =================== RESET SETTINGS
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.me!.settings.generalSettings = action.payload.generalSettings;
        state.me!.settings.notificationSettings =
          action.payload.notificationSettings;
        state.me!.settings.privacySettings = action.payload.privacySettings;
      }),
});

export const { clearError, updateMe } = userSlice.actions;
export default userSlice.reducer;
