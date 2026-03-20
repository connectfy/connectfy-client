import { checkEmptyString, checkUrl } from "@/common/utils/checkValues";
import { IAddSocialLink, IEditProfile, IEditSocialLink } from "../types/types";
import { TFunction } from "i18next";
import { GENDER } from "@/common/enums/enums";

export const validateEditProfile = (values: IEditProfile, t: TFunction) => {
  const { firstName, lastName, gender, birthdayDate } = values;
  const errors: Record<string, any> = {};

  if (!firstName || !checkEmptyString(firstName)) {
    errors.firstName = t("error_messages.first_name_is_required");
  }

  if (!lastName || !checkEmptyString(lastName)) {
    errors.lastName = t("error_messages.last_name_is_required");
  }

  if (!gender || !Object.values(GENDER).includes(gender)) {
    errors.gender = t("error_messages.gender_is_required");
  }

  if (!birthdayDate) {
    errors.birthdayDate = t("error_messages.birthday_is_required");
  }

  return errors;
};

export const validateSocialLink = (
  values: IEditSocialLink | IAddSocialLink,
  t: TFunction,
) => {
  const errors: Record<string, string> = {};
  if (!values.name || !checkEmptyString(values.name)) {
    errors.name = t("error_messages.name_is_required");
  }
  if (!values.url || !checkEmptyString(values.url)) {
    errors.url = t("error_messages.url_is_required");
  }
  if (values.url && !checkUrl(values.url)) {
    errors.url = t("error_messages.url_invalid");
  }
  if (!values.platform || !checkEmptyString(values.platform)) {
    errors.platform = t("error_messages.platform_required");
  }
  return errors;
};
