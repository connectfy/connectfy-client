import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { IEditPrivacySettings, IPrivacySettings } from "../types/types";

export const privacySettingsApi = createApi({
  reducerPath: RESOURCE.PRIVACY_SETTINGS,
  baseQuery: baseQuery,
  tagTypes: ["PrivacySettings"],
  endpoints: (builder) => ({
    // ====================== GET PRIVACY SETTINGS
    getPrivacySettings: builder.query<IPrivacySettings, void>({
      query: () => ({
        url: API_ENDPOINTS.ACCOUNT.SETTINGS.PRIVACY_SETTINGS.GET,
        method: "POST",
      }),
      providesTags: ["PrivacySettings"],
    }),
    // ====================== EDIT PRIVACY SETTINGS
    editPrivacySettings: builder.mutation<
      IPrivacySettings,
      IEditPrivacySettings
    >({
      query: (data) => ({
        url: API_ENDPOINTS.ACCOUNT.SETTINGS.PRIVACY_SETTINGS.UPDATE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PrivacySettings"],
    }),
  }),
});

export const { useGetPrivacySettingsQuery, useEditPrivacySettingsMutation } =
  privacySettingsApi;
