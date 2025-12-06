import {
  IEditPrivacySettings,
  IPrivacySettings,
} from "@/types/account/settings/privacy/privacy-settings.type";
import { ApiErrorType } from "@/types/api.types";
import { Resource } from "@/types/enum.types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";
import { updatePrivacySettingsApi } from "./privacySettingsAPI";
import { resetSettings } from "../general/generalSettingsSlice";

export interface PrivacySettingsState {
  data: IPrivacySettings | null;

  LOADING_GET: boolean;
  LOADING_UPDATE: boolean;

  ERROR_GET: ApiErrorType;
  ERROR_UPDATE: ApiErrorType;
}

export const updatePrivacySettings = createAsyncThunk<
  IPrivacySettings,
  IEditPrivacySettings
>(
  "/account/settings/privacy-settings/update",
  async (data: IEditPrivacySettings, { rejectWithValue }) => {
    try {
      const res = await updatePrivacySettingsApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

const initialState: PrivacySettingsState = {
  data: null,

  LOADING_GET: false,
  LOADING_UPDATE: false,

  ERROR_GET: null,
  ERROR_UPDATE: null,
};

const privacySettingsSlice = createSlice({
  name: Resource.privacySettings,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<IPrivacySettings>) => {
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
      .addCase(updatePrivacySettings.fulfilled, (state, action) => {
        state.LOADING_UPDATE = false;
        state.data = action.payload;
      })
      .addCase(updatePrivacySettings.pending, (state) => {
        state.LOADING_UPDATE = true;
      })
      .addCase(updatePrivacySettings.rejected, (state, action) => {
        state.LOADING_UPDATE = false;
        state.ERROR_UPDATE = action.payload as string | string[];
      })

      // =================== RESET SETTINGS
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.data = action.payload.privacySettings;
      }),
});

export const { clearError, setData } = privacySettingsSlice.actions;
export default privacySettingsSlice.reducer;
