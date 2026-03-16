import { baseQuery } from "@/common/api/axiosBaseQuery";
import {
  PHONE_NUMBER_ACTION,
  RESOURCE,
  TWO_FACTOR_ACTION,
} from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IDeactivateAccount,
  IDeactivateAccountResponse,
  IDeleteAccount,
  ILogoutResponse,
  IUpdateEmail,
  IUpdateEmailResponse,
  IUpdatePassword,
  IUpdatePhoneNumber,
  IUpdateTwoFactor,
  IUpdateUsername,
  IVerifyChangeEmail,
} from "../types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { profileApi } from "@/modules/profile/api/api";
import { IUpdateResponse } from "@/common/interfaces/interfaces";

export const accountSettingsApi = createApi({
  reducerPath: RESOURCE.ACCOUNT_SETTINGS,
  baseQuery: baseQuery,
  tagTypes: ["User", "AccountSettings"],
  endpoints: (builder) => ({
    // ====================== UPDATE USERNAME
    updateUsername: builder.mutation<IUpdateResponse, IUpdateUsername>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_USERNAME,
        method: "PATCH",
        body: data,
      }),
      /**
       * Optimistic update: instantly update profileApi.getMe cache.
       * We patch getMe (undefined arg) because getMe takes void in your code.
       * Rollback on failure.
       */
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // apply optimistic change to getMe
        const patchResult = dispatch(
          profileApi.util.updateQueryData("getMe", undefined, (draft: any) => {
            // guard: draft.user might be undefined in some cases
            if (draft) {
              draft.username = arg.username;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
        }
      },
      /**
       * Invalidate the User tag so other subscribers (if any) refetch.
       * If the response includes the updated user id, return it; otherwise fallback to LIST.
       */
      invalidatesTags: ["User", "AccountSettings"],
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
    updatePassword: builder.mutation<IUpdateResponse, IUpdatePassword>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_PASSWORD,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AccountSettings"],
    }),

    // ====================== VERIFY CHANGE EMAIL
    verifyChangeEmail: builder.mutation<IUpdateResponse, IVerifyChangeEmail>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.VERIFY_CHANGE_EMAIL,
        method: "PATCH",
        body: data,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        if (data) {
          dispatch(
            profileApi.util.updateQueryData(
              "getMe",
              undefined,
              (draft: any) => {
                if (draft) {
                  draft.email = data.email;
                }
              },
            ),
          );
        }
      },

      invalidatesTags: ["User", "AccountSettings"],
    }),

    // ====================== UPDATE PHONE NUMBER
    updatePhoneNumber: builder.mutation<IUpdateResponse, IUpdatePhoneNumber>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_PHONE_NUMBER,
        method: "PATCH",
        body: data,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData("getMe", undefined, (draft: any) => {
            if (draft) {
              const action = arg.action;
              draft.phoneNumber =
                action === PHONE_NUMBER_ACTION.UPDATE ? arg.phoneNumber : null;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["User", "AccountSettings"],
    }),

    // ====================== LOGOUT
    logout: builder.mutation<ILogoutResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // ====================== DELETE ACCOUNT
    deleteAccount: builder.mutation<IUpdateResponse, IDeleteAccount>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.DELETE_ACCOUNT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // ====================== DEACTIVATE ACCOUNT
    deactivateAccount: builder.mutation<
      IDeactivateAccountResponse,
      IDeactivateAccount
    >({
      query: (data) => ({
        url: API_ENDPOINTS.USER.DEACTIVATE_ACCOUNT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateTwoFactor: builder.mutation<IUpdateResponse, IUpdateTwoFactor>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.UPDATE_TWO_FACTOR,
        method: "PATCH",
        body: data,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData("getMe", undefined, (draft: any) => {
            if (draft) {
              draft.isTwoFactorEnabled =
                arg.action === TWO_FACTOR_ACTION.ENABLE;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["User", "AccountSettings"],
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
  useUpdateTwoFactorMutation,
} = accountSettingsApi;
