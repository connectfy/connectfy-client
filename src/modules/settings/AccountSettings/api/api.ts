import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IDeactivateAccount,
  IDeactivateAccountResponse,
  IDeleteAccount,
  IDeleteAccountResponse,
  ILogoutResponse,
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
} from "../types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";

export const accountSettingsApi = createApi({
  reducerPath: RESOURCE.ACCOUNT_SETTINGS,
  baseQuery: baseQuery,
  tagTypes: ["AccountSettings"],
  endpoints: (builder) => ({
    // ====================== UPDATE USERNAME
    updateUsername: builder.mutation<IUpdateUsernameResponse, IUpdateUsername>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_USERNAME,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AccountSettings"],
    }),
    // ====================== UPDATE EMAIL
    updateEmail: builder.mutation<IUpdateEmailResponse, IUpdateEmail>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_EMAIL,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AccountSettings"],
    }),
    // ====================== UPDATE PASSWORD
    updatePassword: builder.mutation<IUpdatePasswordResponse, IUpdatePassword>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_PASSWORD,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AccountSettings"],
    }),
    // ====================== VERIFY CHANGE EMAIL
    verifyChangeEmail: builder.mutation<
      IVerifyChangeEmailResponse,
      IVerifyChangeEmail
    >({
      query: (data) => ({
        url: API_ENDPOINTS.USER.VERIFY_CHANGE_EMAIL,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AccountSettings"],
    }),
    // ====================== UPDATE PHONE NUMBER
    updatePhoneNumber: builder.mutation<
      IUpdatePhoneNumberResponse,
      IUpdatePhoneNumber
    >({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_PHONE_NUMBER,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AccountSettings"],
    }),
    // ====================== LOGOUT
    logout: builder.mutation<ILogoutResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: "POST",
      }),
      invalidatesTags: ["AccountSettings"],
    }),
    // ====================== DELETE ACCOUNT
    deleteAccount: builder.mutation<IDeleteAccountResponse, IDeleteAccount>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.DELETE_ACCOUNT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AccountSettings"],
    }),
    // ====================== DEACTIVATE ACCOUNT
    deactivateAccount: builder.mutation<
      IDeactivateAccountResponse,
      IDeactivateAccount
    >({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.DEACTIVATE_ACCOUNT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AccountSettings"],
    }),
  }),
});

export const {
  useUpdateUsernameMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useVerifyChangeEmailMutation,
  useUpdatePhoneNumberMutation,
  useLogoutMutation,
  useDeleteAccountMutation,
  useDeactivateAccountMutation,
} = accountSettingsApi;
