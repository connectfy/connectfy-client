import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IAccount,
  IAddSocialLink,
  IEditProfile,
  IEditSocialLink,
  IFindSocialLinks,
  IMe,
  IRemoveAllSocialLinks,
  IRemoveSocialLink,
  IUpdateSocialLinkRank,
} from "../types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import {
  IFindAllResponse,
  IRemoveAllResponse,
  IRemoveResponse,
  IUpdateResponse,
} from "@/common/interfaces/interfaces";
import { ISocialLink } from "../types/types";

export const profileApi = createApi({
  reducerPath: RESOURCE.PROFILE,
  baseQuery: baseQuery,
  tagTypes: ["User", "Account", "SocialLink"],
  endpoints: (builder) => ({
    // <====================== PROFILE ======================>
    // <====================== PROFILE ======================>
    // ====================== GET ME
    getMe: builder.query<IMe, void>({
      query: () => ({
        url: API_ENDPOINTS.USER.ME,
        method: "POST",
      }),
      providesTags: (result) =>
        result && result?._id
          ? [{ type: "User", id: result._id }]
          : [{ type: "User", id: "LIST" }],
    }),

    // ====================== GET ACCOUNT
    getAccount: builder.query<IAccount, void>({
      query: () => ({
        url: API_ENDPOINTS.ACCOUNT.PROFILE.GET,
        method: "POST",
      }),
      providesTags: ["Account"],
    }),

    // ====================== UPDATE PROFILE
    updateProfile: builder.mutation<IUpdateResponse, IEditProfile>({
      query: (body) => ({
        url: API_ENDPOINTS.ACCOUNT.PROFILE.UPDATE,
        method: "PATCH",
        body,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { _id, ...updatedFields } = arg;

        const patchResult = dispatch(
          profileApi.util.updateQueryData("getAccount", undefined, (draft) => {
            if (draft) {
              Object.assign(draft, updatedFields);
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Account"],
    }),
    // <====================== PROFILE ======================>
    // <====================== PROFILE ======================>

    // <====================== SOCIAL LINKS ======================>
    // <====================== SOCIAL LINKS ======================>
    // ====================== GET SOCIAL LINKS
    /**
     * Social linkləri gətirir.
     * providesTags: Bu query-nin nəticəsini müəyyən tag-lərlə nişanlayır.
     */
    getSocialLinks: builder.query<
      IFindAllResponse<ISocialLink>,
      IFindSocialLinks
    >({
      query: (body) => ({
        url: API_ENDPOINTS.ACCOUNT.SOCIAL_LINK.GET,
        method: "POST",
        body,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "SocialLink" as const,
                id: _id,
              })),
              { type: "SocialLink", id: "LIST" },
            ]
          : [{ type: "SocialLink", id: "LIST" }],
    }),

    createSocialLink: builder.mutation<ISocialLink, IAddSocialLink>({
      query: (body) => ({
        url: API_ENDPOINTS.ACCOUNT.SOCIAL_LINK.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SocialLink", id: "LIST" }],
    }),

    updateSocialLink: builder.mutation<IUpdateResponse, IEditSocialLink>({
      query: (body) => ({
        url: API_ENDPOINTS.ACCOUNT.SOCIAL_LINK.UPDATE,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { _id }) => [
        { type: "SocialLink", id: _id },
        { type: "SocialLink", id: "LIST" },
      ],
    }),

    updateSocialLinkRank: builder.mutation<
      IUpdateResponse,
      IUpdateSocialLinkRank
    >({
      query: (body) => ({
        url: API_ENDPOINTS.ACCOUNT.SOCIAL_LINK.UPDATE_RANK,
        method: "PATCH",
        body,
      }),
      async onQueryStarted({ userId, links }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData(
            "getSocialLinks",
            { userId },
            (draft) => {
              if (draft?.data) {
                links.forEach((updatedLink) => {
                  const item = draft.data.find(
                    (l) => l._id === updatedLink._id,
                  );
                  if (item) {
                    item.rank = updatedLink.rank;
                  }
                });
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    removeSocialLink: builder.mutation<IRemoveResponse, IRemoveSocialLink>({
      query: (body) => ({
        url: API_ENDPOINTS.ACCOUNT.SOCIAL_LINK.REMOVE,
        method: "DELETE",
        body,
      }),
      invalidatesTags: (_, __, { _id }) => [
        { type: "SocialLink", id: _id },
        { type: "SocialLink", id: "LIST" },
      ],
    }),

    removeSocialLinks: builder.mutation<
      IRemoveAllResponse,
      IRemoveAllSocialLinks
    >({
      query: ({ _ids }) => ({
        url: API_ENDPOINTS.ACCOUNT.SOCIAL_LINK.REMOVE_MANY,
        method: "DELETE",
        body: { _ids },
      }),
      invalidatesTags: [{ type: "SocialLink", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetAccountQuery,
  useUpdateProfileMutation,
  useGetSocialLinksQuery,
  useCreateSocialLinkMutation,
  useUpdateSocialLinkMutation,
  useUpdateSocialLinkRankMutation,
  useRemoveSocialLinkMutation,
  useRemoveSocialLinksMutation,
} = profileApi;
