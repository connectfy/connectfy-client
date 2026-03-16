import { checkEmptyString } from "@/common/utils/checkValues";
import { IEditProfile } from "../types/types";
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
