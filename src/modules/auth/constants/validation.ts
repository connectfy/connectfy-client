import {
  IForgotPasswordForm,
  IGoogleSignupForm,
  ILoginForm,
  IResetPasswordForm,
  ISignupForm,
  ISignupVerifyForm,
  ILoginVerifyForm,
} from "../types/types";
import {
  FORGOT_PASSWORD_IDENTIFIER_TYPE,
  GENDER,
  IDENTIFIER_TYPE,
} from "@/common/enums/enums";
import { checkEmptyString } from "@/common/utils/checkValues";
import { TFunction } from "i18next";

// =======================> LOGIN
export const validateLogin = (
  values: ILoginForm,
  t: TFunction,
): Record<string, any> => {
  const { identifier, identifierType, password } = values;
  const errors: Record<string, any> = {};

  if (
    !identifierType ||
    !Object.values(IDENTIFIER_TYPE).includes(identifierType)
  ) {
    errors.identifierType = t("error_messages.identifier_type_is_required");
  }

  if (!identifier || !checkEmptyString(identifier)) {
    errors.identifier = t(
      `error_messages.${identifierType.toLowerCase()}_is_required`,
    );
  }

  if (!password || !checkEmptyString(password)) {
    errors.password = t("error_messages.password_is_required");
  }

  return errors;
};

// =======================> VERIFY LOGIN
export const validateVerifyLogin = (
  values: ILoginVerifyForm,
  t: TFunction,
): Record<string, any> => {
  const { code } = values;
  const errors: Record<string, any> = {};

  if (!code || !checkEmptyString(code)) {
    errors.code = t("error_messages.code_is_required");
  }

  if (code?.length !== 6) {
    errors.code = t("error_messages.invalid_code");
  }

  return errors;
};

// =======================> SIGNUP
export const validateSignup = (
  values: ISignupForm,
  t: TFunction,
): Record<string, any> => {
  const {
    firstName,
    lastName,
    username,
    email,
    gender,
    birthdayDate,
    // phoneNumber,
    password,
    confirm,
  } = values;
  const errors: Record<string, any> = {};

  // const { countryCode, number, fullPhoneNumber } = phoneNumber;

  const usernameRegex = /^[A-Za-z0-9._-]+$/;
  const passwordComplexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

  if (!firstName || !checkEmptyString(firstName))
    errors.firstName = t("error_messages.first_name_is_required");

  if (!lastName || !checkEmptyString(lastName))
    errors.lastName = t("error_messages.last_name_is_required");

  if (!username || !checkEmptyString(username))
    errors.username = t("error_messages.username_is_required");
  else if (!usernameRegex.test(username))
    errors.username = t("error_messages.invalid_username");
  else if (username.length < 3)
    errors.username = t("error_messages.min_length", {
      field: t("common.username"),
      length: 3,
    });
  else if (username.length > 30)
    errors.username = t("error_message.max_length", {
      field: t("common.username"),
      length: 30,
    });

  if (!email || !checkEmptyString(email))
    errors.email = t("error_messages.email_name_is_required");
  else if (!email.includes("@"))
    errors.email = t("error_messages.invalid_email");

  if (!gender || !Object.values(GENDER).includes(gender))
    errors.gender = t("error_messages.gender_is_required");

  if (!birthdayDate)
    errors.birthdayDate = t("error_messages.birthday_is_required");

  // if (
  //   !countryCode ||
  //   !number ||
  //   !fullPhoneNumber ||
  //   !checkEmptyString(countryCode) ||
  //   !checkEmptyString(number) ||
  //   !checkEmptyString(fullPhoneNumber) ||
  //   fullPhoneNumber !== countryCode + number
  // )
  //   errors.phoneNumber = t("error_messages.phone_number_is_required");

  // const currentCountry = COUNTRIES.find((c) => c.code === countryCode);

  // if (currentCountry && number?.length !== currentCountry.numberLength)
  //   errors.phoneNumber = t("error_messages.phone_number_length", {
  //     length: currentCountry.numberLength,
  //   });

  if (!password || !checkEmptyString(password))
    errors.password = t("error_messages.password_is_required");
  else if (
    password.length < 8 ||
    password.length > 30 ||
    !passwordComplexityRegex.test(password)
  )
    errors.password = t("error_messages.password_rule");

  if (confirm !== password)
    errors.confirm = t("error_messages.password_mismatch");

  return errors;
};

// =======================> VERIFY SIGNUP
export const validateVerifySignup = (
  values: ISignupVerifyForm,
  t: TFunction,
): Record<string, any> => {
  const { verifyCode } = values;
  const errors: Record<string, any> = {};

  if (!verifyCode || !checkEmptyString(verifyCode))
    errors.verifyCode = t("error_messages.code_is_required");

  if (verifyCode?.length !== 6)
    errors.verifyCode = t("error_messages.invalid_code");

  return errors;
};

// =======================> FORGOT PASSWORD
export const validateForgotPassword = (
  values: IForgotPasswordForm,
  t: TFunction,
): Record<string, any> => {
  const { identifierType, identifier } = values;
  const errors: Record<string, any> = {};

  if (
    !identifierType ||
    !Object.keys(FORGOT_PASSWORD_IDENTIFIER_TYPE).includes(identifierType)
  )
    errors.identifierType = t("error_messages.identifier_type_is_required");

  if (!identifier || !checkEmptyString(identifier))
    errors.identifier = t(
      `error_messages.${identifierType.toLowerCase()}_is_required`,
    );

  return errors;
};

// =======================> RESET PASSWORD
export const validateResetPassword = (
  values: IResetPasswordForm,
  t: TFunction,
): Record<string, any> => {
  const { password, confirmPassword } = values;
  const errors: Record<string, any> = {};

  const passwordComplexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

  if (!password || !checkEmptyString(password))
    errors.password = t("error_messages.password_is_required");
  else if (
    password.length < 8 ||
    password.length > 30 ||
    !passwordComplexityRegex.test(password)
  )
    errors.password = t("error_messages.password_rule");

  if (confirmPassword !== password)
    errors.confirmPassword = t("error_messages.password_mismatch");

  return errors;
};

// =======================> GOOGLE SIGNUP
export const valdiateGoogleSignup = (
  values: IGoogleSignupForm,
  t: TFunction,
): Record<string, any> => {
  const { username, gender, birthdayDate } = values;
  const errors: Record<string, any> = {};

  // const { countryCode, number, fullPhoneNumber } = phoneNumber;

  const usernameRegex = /^[A-Za-z0-9._-]+$/;

  if (!username || !checkEmptyString(username))
    errors.username = t("error_messages.username_is_required");
  else if (!usernameRegex.test(username))
    errors.username = t("error_messages.invalid_username");
  else if (username.length < 3)
    errors.username = t("error_messages.min_length", { length: 3 });
  else if (username.length > 30)
    errors.username = t("error_message.max_length", { length: 30 });

  if (!gender || !Object.values(GENDER).includes(gender))
    errors.gender = t("error_messages.gender_is_required");

  if (!birthdayDate)
    errors.birthdayDate = t("error_messages.birthday_is_required");

  // if (
  //   !countryCode ||
  //   !number ||
  //   !fullPhoneNumber ||
  //   !checkEmptyString(countryCode) ||
  //   !checkEmptyString(number) ||
  //   !checkEmptyString(fullPhoneNumber) ||
  //   fullPhoneNumber !== countryCode + number
  // )
  //   errors.phoneNumber = t("error_messages.phone_number_is_required");

  // const currentCountry = COUNTRIES.find((c) => c.code === countryCode);

  // if (currentCountry && number?.length !== currentCountry.numberLength)
  //   errors.phoneNumber = t("error_messages.phone_number_length", {
  //     length: currentCountry.numberLength,
  //   });

  return errors;
};
