import {
  IEditNotificationSettings,
  INotificationSettings,
} from "@/types/account/notification/notification-settings.type";
import { ApiErrorType } from "@/types/api.types";
import { Resource } from "@/types/enum.types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";
import { updateNotificationSettingsApi } from "./notificationSettingsAPI";

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
  "/account/settings/notification-settings/update",
  async (data: IEditNotificationSettings, { rejectWithValue }) => {
    try {
      const res = await updateNotificationSettingsApi(data);
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
  name: Resource.notificationSettings,
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
      }),
});

export const { clearError, setData } = notificationSettingsSlice.actions;
export default notificationSettingsSlice.reducer;
