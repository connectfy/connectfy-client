import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IEditGeneralSettings,
  IGeneralSettings,
  IResetSettings,
} from "../types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";

export const generalSettingsApi = createApi({
  reducerPath: RESOURCE.GENERAL_SETTINGS,
  baseQuery: baseQuery,
  tagTypes: ["GeneralSettings"],
  endpoints: (builder) => ({
    // ====================== GET GENERAL SETTINGS
    getGeneralSettings: builder.query<IGeneralSettings, void>({
      query: () => ({
        url: API_ENDPOINTS.ACCOUNT.SETTINGS.GENERAL_SETTINGS.GET,
        method: "POST",
      }),
      providesTags: ["GeneralSettings"],
    }),
    // ====================== EDIT GENERAL SETTINGS
    editGeneralSettings: builder.mutation<
      IGeneralSettings,
      IEditGeneralSettings
    >({
      query: (data) => ({
        url: API_ENDPOINTS.ACCOUNT.SETTINGS.GENERAL_SETTINGS.UPDATE,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["GeneralSettings"],
    }),
    // ====================== RESET SETTINGS
    resetSettings: builder.mutation<IResetSettings, void>({
      query: () => ({
        url: API_ENDPOINTS.ACCOUNT.SETTINGS.GENERAL_SETTINGS.RESET,
        method: "PATCH",
      }),
      invalidatesTags: ["GeneralSettings"],
    }),
  }),
});

export const {
  useGetGeneralSettingsQuery,
  useEditGeneralSettingsMutation,
  useResetSettingsMutation,
} = generalSettingsApi;
