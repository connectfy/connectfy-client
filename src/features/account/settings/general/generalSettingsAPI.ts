import {
  IEditGeneralSettings,
  IGeneralSettings,
  IResetSettings,
} from "@/types/account/settings/general/general-settings.type";
import axios from "@/helpers/instance";

export const updateGeneralSettingsApi = (data: IEditGeneralSettings) =>
  axios.patch<IGeneralSettings>(
    "/account/settings/general-settings/update",
    data
  );

export const resetSettingsApi = () =>
  axios.patch<IResetSettings>("/account/settings/general-settings/reset");
