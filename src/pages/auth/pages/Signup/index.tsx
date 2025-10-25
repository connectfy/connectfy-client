import "./index.style.css";
import Input from "@/components/Input/Input";
import { useTranslation } from "react-i18next";
import PhoneNumberForm from "@/components/Form/PhoneNumberForm";
import GenderForm from "./components/GenderForm";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import { Link } from "react-router-dom";
import Button from "@/components/Button/Button";
import {
  clearError,
  setAuthForm,
  setSignupForm,
  signup,
} from "@/features/auth/authSlice";
import DatePicker from "@/components/DatePicker";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useFormik } from "formik";
import { signupInitialState } from "../../constants/intialState";
import { validateSignup } from "../../constants/validation";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { IPhoneNumber } from "@/types/auth/auth.type";
import { Resource } from "@/types/enum.types";
import { useEffect, useState } from "react";
import { useToastError } from "@/hooks/useToastError";
import { checkEmptyString } from "@/utils/checkValues";
import Spinner from "@/components/Spinner/Spinner";
import { onPressEnter } from "@/utils/keyPressDown";

const Signup = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { ERROR_SIGNUP, LOADING_SIGNUP, signupForm } = useAppSelector(
    (state) => state[Resource.auth]
  );

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [checked, setChecked] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: signupInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateSignup(values, t),
    onSubmit: async (values, { resetForm }) => {
      const { confirm, ...valuesWithoutConfirm } = values;

      const actionResult = await dispatch(signup(valuesWithoutConfirm));
      const res = unwrapResult(actionResult);
      if (res) {
        toast.success(t("user_messages.signup_successfull"));
        dispatch(setSignupForm(values));
        dispatch(setAuthForm("verify"));
        resetForm();
      }
    },
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    onPressEnter(e, () => {
      if (isDisabled) return;
      formik.handleSubmit();
    });
  };

  useEffect(() => {
    if (signupForm) {
      formik.setValues({ ...signupForm }, true);
    }
  }, [signupForm]);

  useToastError({
    error: ERROR_SIGNUP,
    clearErrorAction: () => clearError("signup"),
  });

  useEffect(() => {
    const {
      firstName,
      lastName,
      username,
      email,
      gender,
      password,
      confirm,
      birthdayDate,
      phoneNumber,
    } = formik.values;

    const stringFields = [
      firstName,
      lastName,
      username,
      email,
      password,
      confirm,
    ];
    const hasEmptyStringField = stringFields.some(
      (v) => !v || !checkEmptyString(v)
    );

    const hasEmptyGender = !gender;
    const hasEmptyDate = !birthdayDate;
    const hasEmptyPhone =
      !phoneNumber ||
      !phoneNumber.countryCode ||
      !phoneNumber.number ||
      !phoneNumber.fullPhoneNumber;

    const shouldDisable =
      hasEmptyStringField ||
      hasEmptyGender ||
      hasEmptyDate ||
      hasEmptyPhone ||
      LOADING_SIGNUP ||
      !checked;

    setIsDisabled(shouldDisable);
  }, [formik.values, checked]);

  return (
    <div className="signup-form">
      <div className="signup-form-block">
        <Input
          inputSize="medium"
          label={t("common.first_name")}
          name="firstName"
          value={formik.values.firstName || ""}
          onBlur={() => formik.setFieldTouched("firstName", true, false)}
          onChange={(e) =>
            formik.setFieldValue("firstName", e.target.value || null)
          }
          onKeyDown={(e) => onKeyDown(e)}
        />
        <Input
          inputSize="medium"
          label={t("common.last_name")}
          name="lastName"
          value={formik.values.lastName || ""}
          onBlur={() => formik.setFieldTouched("lastName", true, false)}
          onChange={(e) =>
            formik.setFieldValue("lastName", e.target.value || null)
          }
          onKeyDown={(e) => onKeyDown(e)}
        />
      </div>
      <div className="signup-form-block">
        <Input
          inputSize="medium"
          label={t("common.username")}
          name="username"
          value={formik.values.username || ""}
          onBlur={() => formik.setFieldTouched("username", true, false)}
          onChange={(e) =>
            formik.setFieldValue("username", e.target.value || null)
          }
          onKeyDown={(e) => onKeyDown(e)}
        />
        <Input
          inputSize="medium"
          label={t("common.email")}
          name="email"
          value={formik.values.email || ""}
          onBlur={() => formik.setFieldTouched("email", true, false)}
          onChange={(e) =>
            formik.setFieldValue("email", e.target.value || null)
          }
          onKeyDown={(e) => onKeyDown(e)}
        />
      </div>
      <div className="signup-form-block">
        <PhoneNumberForm
          name="phoneNumber"
          onBlur={() =>
            formik.setFieldTouched("phoneNumber.number", true, false)
          }
          onChange={(value: IPhoneNumber | null) =>
            formik.setFieldValue("phoneNumber", value)
          }
          blur={formik.touched.phoneNumber?.number ?? false}
          onKeyDown={(e) => onKeyDown(e)}
        />
      </div>
      <div className="signup-form-block">
        <DatePicker
          value={formik.values.birthdayDate?.toString() || ""}
          onChange={(date) => formik.setFieldValue("birthdayDate", date)}
          inputSize="small"
          hasError={false}
          placeholder={t("common.birthday")}
          onKeyDown={(e) => onKeyDown(e)}
        />
      </div>
      <div className="signup-form-block">
        <GenderForm formik={formik} />
      </div>
      <div className="signup-form-block-password">
        <PasswordInput
          inputSize="medium"
          label={t("common.password")}
          showGenerateIcon
          name="password"
          value={formik.values.password || ""}
          onBlur={() => formik.setFieldTouched("password", true, false)}
          onChange={(e) =>
            formik.setFieldValue("password", e.target.value || null)
          }
          onGenerate={(value?: string) => {
            navigator.clipboard.writeText(value as string);
            toast.info(t("user_messages.password_generated_message"), {
              position: "bottom-center",
              autoClose: 10000,
              ariaLabel: "notification",
            });

            formik.setFieldValue("password", value);
            formik.setFieldValue("confirm", value);
          }}
          onKeyDown={(e) => onKeyDown(e)}
        />
        {formik.errors.password && formik.touched.password && (
          <h6>{formik.errors.password}</h6>
        )}
        <PasswordInput
          inputSize="medium"
          label={t("common.confirm_password")}
          name="confirm"
          value={formik.values.confirm || ""}
          onBlur={() => formik.setFieldTouched("confirm", true, false)}
          onChange={(e) =>
            formik.setFieldValue("confirm", e.target.value || null)
          }
          onKeyDown={(e) => onKeyDown(e)}
        />
        {formik.errors.confirm && formik.touched.confirm && (
          <h6>{formik.errors.confirm}</h6>
        )}
      </div>

      <div className="terms-conditions">
        <input
          autoComplete="off"
          type="checkbox"
          id="terms"
          name="terms"
          className="custom-checkbox"
          checked={checked}
          onClick={() => setChecked(!checked)}
          onChange={() => {}}
        />
        <label htmlFor="terms">
          {t("common.terms_prefix")}{" "}
          <Link to={"/terms"} className="terms-link">
            {t("common.terms_link")}
          </Link>{" "}
          {t("common.terms_suffix")}
        </label>
      </div>

      <Button
        fillWidth
        size="small"
        hasAnimation
        onClick={() => {
          if (LOADING_SIGNUP) return;
          formik.handleSubmit();
        }}
        disabled={isDisabled}
        type="button"
      >
        {LOADING_SIGNUP ? <Spinner /> : t("common.signup")}
      </Button>
    </div>
  );
};

export default Signup;
