import {
  IEditPrivacySettings,
  IPrivacySettings,
} from "@/types/account/settings/privacy/privacy-settings.type";
import axios from "@/helpers/instance";

export const updatePrivacySettingsApi = (data: IEditPrivacySettings) =>
  axios.patch<IPrivacySettings>(
    "/account/settings/privacy-settings/update",
    data
  );
