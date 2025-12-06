import {
  IEditGeneralSettings,
  IGeneralSettings,
  IResetSettings,
} from "@/types/account/settings/general/general-settings.type";
import { ApiErrorType } from "@/types/api.types";
import { Resource } from "@/types/enum.types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  resetSettingsApi,
  updateGeneralSettingsApi,
} from "./generalSettingsAPI";
import { t } from "i18next";

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
  "/account/settings/general-settings/update",
  async (data: IEditGeneralSettings, { rejectWithValue }) => {
    try {
      const res = await updateGeneralSettingsApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || t("error_messages.process_failed")
      );
    }
  }
);

export const resetSettings = createAsyncThunk<IResetSettings>(
  "/account/settings/general-settings/reset",
  async (_, { rejectWithValue }) => {
    try {
      const res = await resetSettingsApi();
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
  name: Resource.generalSettings,
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
