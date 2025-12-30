import {
  IEditGeneralSettings,
  IGeneralSettings,
  IResetSettings,
} from "../types/types";
import { ApiErrorType } from "@/common/types/types";
import { RESOURCE } from "@/common/enums/enums";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import axios from "@/common/helpers/instance";

export interface GeneralSettingsState {
  data: IGeneralSettings | null;

  hasChanged: boolean;

  LOADING_GET: boolean;
  LOADING_UPDATE: boolean;
  LOADING_RESET_SETTINGS: boolean;

  ERROR_GET: ApiErrorType;
  ERROR_UPDATE: ApiErrorType;
  ERROR_RESET_SETTINGS: ApiErrorType;
}

export const updateGeneralSettings = createAsyncThunk<
  IGeneralSettings,
  IEditGeneralSettings
>(
  API_ENDPOINTS.ACCOUNT.SETTINGS.GENERAL_SETTINGS.UPDATE,
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.patch<IGeneralSettings>(
        API_ENDPOINTS.ACCOUNT.SETTINGS.GENERAL_SETTINGS.UPDATE,
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

export const resetSettings = createAsyncThunk<IResetSettings>(
  API_ENDPOINTS.ACCOUNT.SETTINGS.GENERAL_SETTINGS.RESET,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.patch<IResetSettings>(
        API_ENDPOINTS.ACCOUNT.SETTINGS.GENERAL_SETTINGS.RESET
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

const initialState: GeneralSettingsState = {
  data: null,

  hasChanged: false,

  LOADING_GET: false,
  LOADING_UPDATE: false,
  LOADING_RESET_SETTINGS: false,

  ERROR_GET: null,
  ERROR_UPDATE: null,
  ERROR_RESET_SETTINGS: null,
};

const generalSettingsSlice = createSlice({
  name: RESOURCE.GENERAL_SETTINGS,
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<IGeneralSettings>) => {
      state.data = action.payload;
    },
    setHasChanged: (state, action: PayloadAction<boolean>) => {
      state.hasChanged = action.payload;
    },
    clearError: (state) => {
      state.ERROR_GET = null;
      state.ERROR_UPDATE = null;
      state.ERROR_RESET_SETTINGS = null;
    },
  },
  extraReducers: (builder) =>
    builder
      // =================== UPDATE
      .addCase(updateGeneralSettings.fulfilled, (state, action) => {
        state.LOADING_UPDATE = false;
        state.data = action.payload;
      })
      .addCase(updateGeneralSettings.pending, (state) => {
        state.LOADING_UPDATE = true;
      })
      .addCase(updateGeneralSettings.rejected, (state, action) => {
        state.LOADING_UPDATE = false;
        state.ERROR_UPDATE = action.payload as string | string[];
      })

      // =================== RESET SETTINGS
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.LOADING_RESET_SETTINGS = false;
        state.data = action.payload.generalSettings;
      })
      .addCase(resetSettings.pending, (state) => {
        state.LOADING_RESET_SETTINGS = true;
      })
      .addCase(resetSettings.rejected, (state, action) => {
        state.LOADING_RESET_SETTINGS = false;
        state.ERROR_RESET_SETTINGS = action.payload as string | string[];
      }),
});

export const { clearError, setData, setHasChanged } =
  generalSettingsSlice.actions;
export default generalSettingsSlice.reducer;
