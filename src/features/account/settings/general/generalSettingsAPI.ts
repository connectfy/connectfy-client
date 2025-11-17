import {
  IEditGeneralSettings,
  IGeneralSettings,
} from "@/types/account/general/general-settings.type";
import axios from "@/helpers/instance";

export const updateGeneralSettingsApi = (data: IEditGeneralSettings) =>
  axios.patch<IGeneralSettings>(
    "/account/settings/general-settings/update",
    data
  );
