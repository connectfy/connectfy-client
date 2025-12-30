import { RESOURCE } from "@/common/enums/enums";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";
import { ApiErrorType } from "@/common/types/types";
import { updatePrivacySettings } from "@/modules/settings/PrivacySettings/api/api";
import { updateNotificationSettings } from "@/modules/settings/NotificationSettings/api/api";
import {
  updatePhoneNumber,
  updateUsername,
  verifyChangeEmail,
} from "@/modules/settings/AccountSettings/api/api";
import axios from "@/common/helpers/instance";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { IMe } from "../types/types";
import { resetSettings, updateGeneralSettings } from "@/modules/settings/GeneralSettings/api/api";

export interface ProfileState {
  me: IMe | null;

  LOADING_ME: boolean;

  ERROR_ME: ApiErrorType;
}

// ================== ME
export const me = createAsyncThunk<IMe>(
  API_ENDPOINTS.USER.ME,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_ENDPOINTS.USER.ME);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

const initialState: ProfileState = {
  me: null,

  LOADING_ME: false,

  ERROR_ME: null,
};

const profileSlice = createSlice({
  name: RESOURCE.PROFILE,
  initialState,
  reducers: {
    clearError: (state, action: PayloadAction<"me">) => {
      switch (action.payload) {
        case "me":
          state.ERROR_ME = null;
          break;
        default:
          break;
      }
    },
    updateMe: (state, action: PayloadAction<Partial<IMe>>) => {
      state.me = { ...state.me, ...(action.payload as IMe) };
    },
    clearMe: (state) => {
      state.me = null;
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

      // =================== RESET SETTINGS
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.me!.settings.generalSettings = action.payload.generalSettings;
        state.me!.settings.notificationSettings =
          action.payload.notificationSettings;
        state.me!.settings.privacySettings = action.payload.privacySettings;
      })

      // =================== GENERAL SETTINGS
      .addCase(updateGeneralSettings.fulfilled, (state, action) => {
        state.me!.settings.generalSettings = action.payload;
      })

      // =================== PRIVACY SETTINGS
      .addCase(updatePrivacySettings.fulfilled, (state, action) => {
        state.me!.settings.privacySettings = action.payload;
      })

      // =================== NOTIFICATION SETTINGS
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.me!.settings.notificationSettings = action.payload;
      })

      // ====================== UPDATE USERNAME
      .addCase(updateUsername.fulfilled, (state, action) => {
        state.me!.user.username = action.payload.username;
      })

      // ====================== VERIFY CHANGE EMAIL
      .addCase(verifyChangeEmail.fulfilled, (state, action) => {
        state.me!.user.email = action.payload.email;
      })

      // ================== UPDATE PHONE NUMBER
      .addCase(updatePhoneNumber.fulfilled, (state, action) => {
        state.me!.user.phoneNumber = action.payload.phoneNumber;
      }),
});

export const { clearError, updateMe, clearMe } = profileSlice.actions;
export default profileSlice.reducer;
