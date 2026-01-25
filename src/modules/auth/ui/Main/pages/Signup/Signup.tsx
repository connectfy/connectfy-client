import "./signup.style.css";
import Input from "@/components/ui/CustomInput/Input/Input.tsx";
import PasswordInput from "@/components/ui/CustomInput/PasswordInput/PasswordInput.tsx";
import { useTranslation } from "react-i18next";
import GenderForm from "@/components/Form/GenderForm/GenderForm";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Buttons/Button/Button";
import { clearError, setSignupForm, signup } from "../../../../api/api";
import DatePicker from "@/components/DatePicker/DatePicker";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useFormik } from "formik";
import { signupInitialState } from "../../../../constants/intialState";
import { validateSignup } from "../../../../constants/validation";
import { unwrapResult } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEYS, RESOURCE, THEME } from "@/common/enums/enums";
import { useEffect, useState } from "react";
import { useToastError } from "@/hooks/useToastError";
import { checkEmptyString } from "@/common/utils/checkValues";
import Spinner from "@/components/Spinner/Spinner";
import { ROUTER } from "@/common/constants/routet";
import { snack } from "@/common/utils/snackManager";
import useFormDisabled from "@/hooks/useFormDisabled";
import { ISignupForm } from "@/modules/auth/types/types";

const Signup = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { ERROR_SIGNUP, LOADING_SIGNUP, signupForm } = useAppSelector(
    (state) => state[RESOURCE.AUTH]
  );

  // const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [checked, setChecked] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: signupInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateSignup(values, t),
    onSubmit: async (values, { resetForm }) => {
      const { confirm, ...rest } = values;
      void confirm;
      rest.birthdayDate = rest.birthdayDate
        ? new Date(rest.birthdayDate)
        : null;

      rest.theme = (localStorage.getItem(LOCAL_STORAGE_KEYS.APP_THEME) as THEME) || THEME.LIGHT;

      const actionResult = await dispatch(signup(rest));
      const res = unwrapResult(actionResult);
      if (res) {
        // snack.success(t("user_messages.signup_successful"));
        dispatch(setSignupForm(values));
        navigate(ROUTER.AUTH.VERIFY_ACCOUNT);
        resetForm();
      }
    },
  });

  const isDisabled = useFormDisabled<ISignupForm>({
    formik,
    loading: LOADING_SIGNUP,
    validationRules: [
      (values) => {
        const stringFields = [
          values.firstName,
          values.lastName,
          values.username,
          values.email,
          values.password,
          values.confirm,
        ];
        return !stringFields.some((v) => !v || !checkEmptyString(v));
      },
      (values) => !!values.gender,
      (values) => !!values.birthdayDate,
      checked,
    ],
  });

  useToastError({
    error: ERROR_SIGNUP,
    clearErrorAction: () => clearError("signup"),
  });

  useEffect(() => {
    if (signupForm) {
      formik.setValues({ ...signupForm }, true);
    }
  }, [formik, signupForm]);

  useEffect(() => {
    if (isDisabled) return;

    const handleSubmitEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        formik.handleSubmit();
      }
    };

    document.addEventListener("keydown", handleSubmitEnter);
    return () => {
      document.removeEventListener("keydown", handleSubmitEnter);
    };
  }, [isDisabled, formik]);

  return (
    <div className="signup-form">
      <div className="signup-form-block">
        <Input
          inputSize="medium"
          title={t("common.first_name")}
          name="firstName"
          value={formik.values.firstName || ""}
          onBlur={() => formik.setFieldTouched("firstName", true, false)}
          onChange={(e) => {
            const value = e.target.value || null;

            if (value && value.length > 50) return;

            formik.setFieldValue("firstName", value || null);
          }}
          isError={!!(formik.errors.firstName && formik.touched.firstName)}
          error={formik.errors.firstName}
        />
        <Input
          inputSize="medium"
          title={t("common.last_name")}
          name="lastName"
          value={formik.values.lastName || ""}
          onBlur={() => formik.setFieldTouched("lastName", true, false)}
          onChange={(e) => {
            const value = e.target.value || null;

            if (value && value.length > 50) return;

            formik.setFieldValue("lastName", value || null);
          }}
          isError={!!(formik.errors.lastName && formik.touched.lastName)}
          error={formik.errors.lastName}
        />
      </div>
      <div className="signup-form-block">
        <Input
          inputSize="medium"
          title={t("common.username")}
          name="username"
          value={formik.values.username || ""}
          onBlur={() => formik.setFieldTouched("username", true, false)}
          onChange={(e) => {
            const value = e.target.value || null;

            if (value && value.length > 30) return;

            formik.setFieldValue("username", value || null);
          }}
          isError={!!(formik.errors.username && formik.touched.username)}
          error={formik.errors.username}
        />
        <Input
          inputSize="medium"
          title={t("common.email")}
          name="email"
          value={formik.values.email || ""}
          onBlur={() => formik.setFieldTouched("email", true, false)}
          onChange={(e) => {
            const value = e.target.value || null;

            if (value && value.length > 254) return;

            formik.setFieldValue("email", value || null);
          }}
          isError={!!(formik.errors.email && formik.touched.email)}
          error={formik.errors.email}
        />
      </div>
      <div className="signup-form-block">
        <div style={{ width: "100%" }}>
          <DatePicker
            value={formik.values.birthdayDate?.toString() || ""}
            onChange={(date) => formik.setFieldValue("birthdayDate", date)}
            inputSize="small"
            placeholder={t("common.birthday")}
            hasError={
              !!(formik.errors.birthdayDate && formik.touched.birthdayDate)
            }
          />
          {formik.errors.birthdayDate && formik.touched.birthdayDate && (
            <h6>{formik.errors.birthdayDate}</h6>
          )}
        </div>
      </div>
      <div className="signup-form-block">
        <div style={{ width: "100%" }}>
          <GenderForm formik={formik} formId="signup" />
          {formik.errors.gender && <h6>{formik.errors.gender}</h6>}
        </div>
      </div>
      <div className="signup-form-block-password">
        <PasswordInput
          inputSize="medium"
          title={t("common.password")}
          showGenerateButton
          name="password"
          value={formik.values.password || ""}
          onBlur={() => formik.setFieldTouched("password", true, false)}
          onChange={(e) => {
            const value = e.target.value || null;

            if (value && value.length > 30) return;

            formik.setFieldValue("password", value || null);
          }}
          onGenerate={(value?: string) => {
            navigator.clipboard.writeText(value as string);
            snack.info(t("user_messages.password_generated_message"), {
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 10000,
            });

            formik.setFieldValue("password", value);
            formik.setFieldValue("confirm", value);
          }}
          isError={!!(formik.errors.password && formik.touched.password)}
          error={formik.errors.password}
        />
        <PasswordInput
          inputSize="medium"
          title={t("common.confirm_password")}
          name="confirm"
          value={formik.values.confirm || ""}
          onBlur={() => formik.setFieldTouched("confirm", true, false)}
          onChange={(e) => {
            const value = e.target.value || null;

            if (value && value.length > 30) return;

            formik.setFieldValue("confirm", value || null);
          }}
          isError={!!(formik.errors.confirm && formik.touched.confirm)}
          error={formik.errors.confirm}
        />
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
          <span
            onClick={() => navigate(ROUTER.TERMS_AND_CONDITIONS)}
            className="terms-link"
          >
            {t("common.terms_link")}
          </span>{" "}
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
