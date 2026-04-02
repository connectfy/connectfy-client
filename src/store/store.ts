import { configureStore, combineReducers, Action } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { authApi } from "@/modules/auth/api/api";
import { profileApi } from "@/modules/profile/api/api";
import { accountSettingsApi } from "@/modules/settings/AccountSettings/api/api";
import { generalSettingsApi } from "@/modules/settings/GeneralSettings/api/api";
import { privacySettingsApi } from "@/modules/settings/PrivacySettings/api/api";
import { notificationSettingsApi } from "@/modules/settings/NotificationSettings/api/api";
import { allUsersApi } from "@/modules/users/AllUsers/api/api";
import { userProfileApi } from "@/modules/users/UserProfile/api/api";

export const apis = [
  authApi,
  profileApi,
  accountSettingsApi,
  generalSettingsApi,
  privacySettingsApi,
  notificationSettingsApi,
  allUsersApi,
  userProfileApi,
];

const appReducer = combineReducers(
  Object.fromEntries(apis.map((api) => [api.reducerPath, api.reducer])),
) as any;

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: Action) => {
  if (action.type === "RESET") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apis.map((api) => api.middleware)),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
