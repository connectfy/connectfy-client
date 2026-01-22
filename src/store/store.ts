import { RESOURCE } from "@/common/enums/enums";
import { combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";

// Auth
import authReducer from "@/modules/auth/api/api";

// Account
import accountReducer from "@/modules/profile/api/api";
import accountSettingsReducer, { logout } from "@/modules/settings/AccountSettings/api/api";
import generalSettingsReducer from "@/modules/settings/GeneralSettings/api/api";
import privacySettingsReducer from "@/modules/settings/PrivacySettings/api/api";
import notificationSettingsReducer from "@/modules/settings/NotificationSettings/api/api";

const appReducer = combineReducers({
  // Auth
  [RESOURCE.AUTH]: authReducer,

  // Account
  [RESOURCE.PROFILE]: accountReducer,
  [RESOURCE.ACCOUNT_SETTINGS]: accountSettingsReducer,
  [RESOURCE.GENERAL_SETTINGS]: generalSettingsReducer,
  [RESOURCE.PRIVACY_SETTINGS]: privacySettingsReducer,
  [RESOURCE.NOTIFICATION_SETTINGS]: notificationSettingsReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_APP") state = undefined;

  return appReducer(state, action);
};

export const resetMiddleware: Middleware =
  (storeAPI) => (next) => (action: any) => {
    const result = next(action);

    if (action.type === logout.fulfilled.type) {
      // localStorage təmizləmək (və ya lazımi cleanup)
      localStorage.removeItem("access_token");
      storeAPI.dispatch({ type: "RESET_APP" });
    }

    return result;
  };

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(resetMiddleware),
  devTools: import.meta.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
