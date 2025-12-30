import { ApiErrorType } from "@/common/types/types";
import { RESOURCE } from "@/common/enums/enums";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import axios from "@/common/helpers/instance";
import { resetSettings } from "../../GeneralSettings/api/api";
import { IEditNotificationSettings, INotificationSettings } from "../types/types";

export interface NotificationSettingsState {
  data: INotificationSettings | null;

  LOADING_GET: boolean;
  LOADING_UPDATE: boolean;

  ERROR_GET: ApiErrorType;
  ERROR_UPDATE: ApiErrorType;
}

export const updateNotificationSettings = createAsyncThunk<
  INotificationSettings,
  IEditNotificationSettings
>(
  API_ENDPOINTS.ACCOUNT.SETTINGS.NOTIFICATION_SETTINGS.UPDATE,
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.patch<INotificationSettings>(
        API_ENDPOINTS.ACCOUNT.SETTINGS.NOTIFICATION_SETTINGS.UPDATE,
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

const initialState: NotificationSettingsState = {
  data: null,

  LOADING_GET: false,
  LOADING_UPDATE: false,

  ERROR_GET: null,
  ERROR_UPDATE: null,
};

const notificationSettingsSlice = createSlice({
  name: RESOURCE.NOTIFICATION_SETTINGS,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<INotificationSettings>) => {
      state.data = action.payload;
    },
    clearError: (state) => {
      state.ERROR_GET = null;
      state.ERROR_UPDATE = null;
    },
  },
  extraReducers: (builder) =>
    builder
      // =================== UPDATE
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.LOADING_UPDATE = false;
        state.data = action.payload;
      })
      .addCase(updateNotificationSettings.pending, (state) => {
        state.LOADING_UPDATE = true;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.LOADING_UPDATE = false;
        state.ERROR_UPDATE = action.payload as string | string[];
      })

      // =================== RESET SETTINGS
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.data = action.payload.notificationSettings;
      }),
});

export const { clearError, setData } = notificationSettingsSlice.actions;
export default notificationSettingsSlice.reducer;
