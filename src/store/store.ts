import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/modules/auth/api/api";
import { profileApi } from "@/modules/profile/api/api";
import { accountSettingsApi } from "@/modules/settings/AccountSettings/api/api";
import { generalSettingsApi } from "@/modules/settings/GeneralSettings/api/api";
import { privacySettingsApi } from "@/modules/settings/PrivacySettings/api/api";
import { notificationSettingsApi } from "@/modules/settings/NotificationSettings/api/api";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [accountSettingsApi.reducerPath]: accountSettingsApi.reducer,
    [generalSettingsApi.reducerPath]: generalSettingsApi.reducer,
    [privacySettingsApi.reducerPath]: privacySettingsApi.reducer,
    [notificationSettingsApi.reducerPath]: notificationSettingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      profileApi.middleware,
      accountSettingsApi.middleware,
      generalSettingsApi.middleware,
      privacySettingsApi.middleware,
      notificationSettingsApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
