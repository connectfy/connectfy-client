import Input from "@/components/ui/CustomInput/Input/Input.tsx";
import PasswordInput from "@/components/ui/CustomInput/PasswordInput/PasswordInput.tsx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { signupInitialState } from "../../constants/intialState";
import { validateSignup } from "../../constants/validation";
import { GENDER, LOCAL_STORAGE_KEYS, THEME } from "@/common/enums/enums";
import { Fragment, useEffect, useState } from "react";
import { checkEmptyString } from "@/common/utils/checkValues";
import { ROUTER } from "@/common/constants/routet";
import useFormDisabled from "@/hooks/useFormDisabled";
import { ISignupForm } from "@/modules/auth/types/types";
import Checkbox from "@/components/ui/CustomCheckbox/Checkbox/Checkbox";
import DatePicker from "@/components/ui/DatePicker/DatePicker";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useSignupMutation } from "@/modules/auth/api/api";
import { useErrors } from "@/hooks/useErrors";
import MainFooter from "../components/Footer/MainFooter/MainFooter";
import { Mail, User } from "lucide-react";
import { useAppNavigation } from "@/hooks/useAppNavigation";

const Signup = () => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigation();
  const { showFormikErrors } = useErrors();

  const signupForm = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEYS.SIGNUP_FORM) || "{}",
  ) as ISignupForm | null;
  const [signup, { isLoading: LOADING_SIGNUP }] = useSignupMutation();

  const { showResponseErrors } = useErrors();

  const [checked, setChecked] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: signupForm || signupInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateSignup(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const { confirm, ...rest } = values;
        void confirm;
        rest.birthdayDate = rest.birthdayDate
          ? new Date(rest.birthdayDate)
          : null;

        rest.theme =
          (localStorage.getItem(LOCAL_STORAGE_KEYS.APP_THEME) as THEME) ||
          THEME.LIGHT;

        await signup(rest).unwrap();
        resetForm();
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.SIGNUP_FORM,
          JSON.stringify(values),
        );
        navigate(ROUTER.AUTH.VERIFY_SIGNUP, { replace: true });
      } catch (error) {
        showResponseErrors(error);
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

  const selectGender = (gender: GENDER) => {
    if (formik.values.gender === gender) {
      formik.setFieldValue("gender", null);
    } else {
      formik.setFieldValue("gender", gender);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      showFormikErrors(errors);
      return;
    }
    formik.handleSubmit(e as any);
  };

  useEffect(() => {
    if (isDisabled) return;

    const handleSubmitEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit(e as any);
      }
    };

    document.addEventListener("keydown", handleSubmitEnter);
    return () => {
      document.removeEventListener("keydown", handleSubmitEnter);
    };
  }, [isDisabled, formik]);

  return (
    <Fragment>
      <div className="space-y-2 mb-5">
        <h2 className="text-3xl font-bold tracking-tight text-(--text-(--primary-color))">
          {t("common.join_connectfy")}
        </h2>
        <p className="text-(--text-secondary) text-sm">
          {t("common.join_connectfy_description")}
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-input-border bg-white dark:bg-form-bg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#99c2aa]/30 focus:ring-2 focus:ring-primary outline-none"
              type="text"
              name="firstName"
              title={t("common.first_name")}
              isFloating
              icon={<User size={20} />}
              value={formik.values.firstName || ""}
              onChange={formik.handleChange}
              isError={!!formik.errors.firstName}
              maxLength={50}
            />
          </div>
          <div className="space-y-1.5">
            <Input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-input-border bg-white dark:bg-form-bg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#99c2aa]/30 focus:ring-2 focus:ring-primary outline-none"
              type="text"
              name="lastName"
              title={t("common.last_name")}
              isFloating
              icon={<User size={20} />}
              value={formik.values.lastName || ""}
              onChange={formik.handleChange}
              isError={!!formik.errors.lastName}
              maxLength={50}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-input-border bg-white dark:bg-form-bg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#99c2aa]/30 focus:ring-2 focus:ring-primary outline-none"
              type="text"
              name="username"
              title={t("common.username")}
              isFloating
              icon={<User size={20} />}
              value={formik.values.username || ""}
              onChange={formik.handleChange}
              isError={!!formik.errors.username}
              maxLength={30}
            />
          </div>
          <div className="space-y-1.5">
            <Input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-input-border bg-white dark:bg-form-bg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#99c2aa]/30 focus:ring-2 focus:ring-primary outline-none"
              type="email"
              name="email"
              title={t("common.email")}
              isFloating
              icon={<Mail size={20} />}
              value={formik.values.email || ""}
              onChange={formik.handleChange}
              isError={!!formik.errors.email}
              maxLength={254}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <DatePicker
            value={formik.values.birthdayDate?.toString() || ""}
            onChange={(date) => formik.setFieldValue("birthdayDate", date)}
            inputSize="large"
            placeholder={t("common.birthday")}
            hasError={
              !!(formik.errors.birthdayDate && formik.touched.birthdayDate)
            }
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Object.keys(GENDER).map((gender) => (
            <Button
              key={gender}
              className={`cursor-pointer py-4 px-2 border border-(--input-border) rounded-lg text-sm font-medium hover:border-primary transition-colors text-(--text-secondary) duration-900 ${formik.values.gender === gender ? "bg-(--primary-color) text-white" : ""}`}
              type="button"
              onClick={() => selectGender(gender as GENDER)}
              title={t(`enum.${gender.toLowerCase()}`)}
            />
          ))}
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="relative">
              <PasswordInput
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-input-border bg-white dark:bg-form-bg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                type="password"
                title={t("common.password")}
                isFloating
                showGenerateButton
                onGenerate={(value) => {
                  formik.setFieldValue("password", value);
                  formik.setFieldValue("confirm", value);
                }}
                name="password"
                value={formik.values.password || ""}
                onChange={formik.handleChange}
                isError={!!formik.errors.password}
                maxLength={30}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="relative">
              <PasswordInput
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-input-border bg-white dark:bg-form-bg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                type="password"
                title={t("common.confirm_password")}
                isFloating
                name="confirm"
                value={formik.values.confirm || ""}
                onChange={formik.handleChange}
                isError={!!formik.errors.confirm}
                maxLength={30}
              />
            </div>
          </div>
        </div>
        <div className="py-1">
          <Checkbox
            id="terms"
            checked={checked}
            onChange={() => setChecked(!checked)}
          >
            {t("common.terms_prefix")}{" "}
            <Link
              to={ROUTER.TERMS_AND_CONDITIONS}
              className="text-(--primary-color) underline cursor-pointer"
              target="_blank"
            >
              {t("common.terms_link")}
            </Link>{" "}
            {t("common.terms_suffix")}
          </Checkbox>
        </div>
        <Button
          className="duration-400 h-[60px] w-full py-4 font-bold text-lg rounded-xl transition-all transform active:scale-[0.98] hover:brightness-110 shadow-[0_4px_14px_0_rgba(52,211,153,0.39)] bg-(--primary-color) text-[#020a06]"
          type="submit"
          disabled={isDisabled}
          isLoading={LOADING_SIGNUP}
          title={t("common.signup")}
        />
      </form>

      <MainFooter />
    </Fragment>
  );
};

export default Signup;
