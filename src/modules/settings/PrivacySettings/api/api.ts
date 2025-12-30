import { ApiErrorType } from "@/common/types/types";
import { RESOURCE } from "@/common/enums/enums";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import axios from "@/common/helpers/instance";
import { resetSettings } from "../../GeneralSettings/api/api";
import { IEditPrivacySettings, IPrivacySettings } from "../types/types";

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
  API_ENDPOINTS.ACCOUNT.SETTINGS.PRIVACY_SETTINGS.UPDATE,
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.patch<IPrivacySettings>(
        API_ENDPOINTS.ACCOUNT.SETTINGS.PRIVACY_SETTINGS.UPDATE,
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

const initialState: PrivacySettingsState = {
  data: null,

  LOADING_GET: false,
  LOADING_UPDATE: false,

  ERROR_GET: null,
  ERROR_UPDATE: null,
};

const privacySettingsSlice = createSlice({
  name: RESOURCE.PRIVACY_SETTINGS,
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
