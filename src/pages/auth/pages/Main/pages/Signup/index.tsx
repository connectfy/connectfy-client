import "./index.style.css";
import Input from "@/components/Input/Input";
import { useTranslation } from "react-i18next";
import GenderForm from "./components/GenderForm";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/Button";
import { clearError, setSignupForm, signup } from "@/features/auth/authSlice";
import DatePicker from "@/components/DatePicker";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useFormik } from "formik";
import { signupInitialState } from "../../../../constants/intialState";
import { validateSignup } from "../../../../constants/validation";
import { unwrapResult } from "@reduxjs/toolkit";
import { Resource } from "@/types/enum.types";
import { useEffect, useState } from "react";
import { useToastError } from "@/hooks/useToastError";
import { checkEmptyString } from "@/utils/checkValues";
import Spinner from "@/components/Spinner/Spinner";
import { ROUTER } from "@/constants/routet";
import { snack } from "@/utils/snackManager";
import useFormDisabled from "@/hooks/useFormDisabled";
import { ISignupForm } from "@/types/auth/auth.type";

const Signup = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { ERROR_SIGNUP, LOADING_SIGNUP, signupForm } = useAppSelector(
    (state) => state[Resource.auth]
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
      const { confirm, ...valuesWithoutConfirm } = values;

      const actionResult = await dispatch(signup(valuesWithoutConfirm));
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
  }, [signupForm]);

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
  }, [isDisabled, formik.handleSubmit]);

  return (
    <div className="signup-form">
      <div className="signup-form-block">
        <div>
          <Input
            inputSize="medium"
            label={t("common.first_name")}
            name="firstName"
            value={formik.values.firstName || ""}
            onBlur={() => formik.setFieldTouched("firstName", true, false)}
            onChange={(e) =>
              formik.setFieldValue("firstName", e.target.value || null)
            }
            hasError={!!(formik.errors.firstName && formik.touched.firstName)}
          />
          {formik.errors.firstName && formik.touched.firstName && (
            <h6>{formik.errors.firstName}</h6>
          )}
        </div>
        <div>
          <Input
            inputSize="medium"
            label={t("common.last_name")}
            name="lastName"
            value={formik.values.lastName || ""}
            onBlur={() => formik.setFieldTouched("lastName", true, false)}
            onChange={(e) =>
              formik.setFieldValue("lastName", e.target.value || null)
            }
            hasError={!!(formik.errors.lastName && formik.touched.lastName)}
          />
          {formik.errors.lastName && formik.touched.lastName && (
            <h6>{formik.errors.lastName}</h6>
          )}
        </div>
      </div>
      <div className="signup-form-block">
        <div>
          <Input
            inputSize="medium"
            label={t("common.username")}
            name="username"
            value={formik.values.username || ""}
            onBlur={() => formik.setFieldTouched("username", true, false)}
            onChange={(e) =>
              formik.setFieldValue("username", e.target.value || null)
            }
            hasError={!!(formik.errors.username && formik.touched.username)}
          />
          {formik.errors.username && formik.touched.username && (
            <h6>{formik.errors.username}</h6>
          )}
        </div>
        <div>
          <Input
            inputSize="medium"
            label={t("common.email")}
            name="email"
            value={formik.values.email || ""}
            onBlur={() => formik.setFieldTouched("email", true, false)}
            onChange={(e) =>
              formik.setFieldValue("email", e.target.value || null)
            }
            hasError={!!(formik.errors.email && formik.touched.email)}
          />
          {formik.errors.email && formik.touched.email && (
            <h6>{formik.errors.email}</h6>
          )}
        </div>
      </div>
      {/* <div className="signup-form-block">
        <PhoneNumberForm
          name="phoneNumber"
          onBlur={() =>
            formik.setFieldTouched("phoneNumber.number", true, false)
          }
          onChange={(value: IPhoneNumber | null) =>
            formik.setFieldValue("phoneNumber", value)
          }
          blur={formik.touched.phoneNumber?.number ?? false}
          value={formik.values.phoneNumber}
        />
      </div> */}
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
          hasError={!!(formik.errors.password && formik.touched.password)}
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
          hasError={!!(formik.errors.confirm && formik.touched.confirm)}
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
