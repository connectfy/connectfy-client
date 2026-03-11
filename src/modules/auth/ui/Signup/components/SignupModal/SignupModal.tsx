import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { googleSignupInitialState } from "../../../../constants/intialState";
import { valdiateGoogleSignup } from "../../../../constants/validation";
import { GENDER, LOCAL_STORAGE_KEYS, THEME } from "@/common/enums/enums";
import { checkEmptyString } from "@/common/utils/checkValues";
import { ROUTER } from "@/common/constants/routet";
import { snack } from "@/common/utils/snackManager";
import { onPressEnter, onPressEsc } from "@/common/utils/keyPressDown";
import { useGoogleSignupMutation } from "@/modules/auth/api/api";

// MUI Components (Sadece loading üçün)
import Modal from "@/components/Modal";
import Input from "@/components/ui/CustomInput/Input/Input";
import CustomDatePicker from "@/components/ui/DatePicker/DatePicker";
import Button from "@/components/ui/CustomButton/Button/Button";
import Spinner from "@/components/Spinner/Spinner";

// Hooks
import { useErrors } from "@/hooks/useErrors";
import { useAuthStore } from "@/hooks/useAuthStore";

interface SignupModalProps {
  idToken: string | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

const SignupModal = ({
  idToken,
  isOpen,
  onClose,
  isLoading,
}: SignupModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { setToken } = useAuthStore();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [googleSignup, { isLoading: LOADING_GOOGLE_SIGNUP }] =
    useGoogleSignupMutation();

  const { showResponseErrors } = useErrors();

  const formik = useFormik({
    initialValues: googleSignupInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => valdiateGoogleSignup(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        values.birthdayDate = values.birthdayDate
          ? new Date(values.birthdayDate)
          : null;

        values.theme =
          (localStorage.getItem(LOCAL_STORAGE_KEYS.APP_THEME) as THEME) ||
          THEME.LIGHT;

        const res = await googleSignup(values).unwrap();
        snack.success(t("user_messages.signup_successful"));
        setToken({
          type: "access_token",
          token: res.access_token,
        });
        navigate(ROUTER.MESSENGER.MAIN);
        resetForm();
        onClose();
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (isLoading) return;

    switch (e.key) {
      case "Enter":
        onPressEnter(e, () => {
          if (isDisabled) return;
          formik.handleSubmit();
        });
        break;
      case "Escape":
        onPressEsc(e, onClose);
    }
  };

  const selectGender = (gender: GENDER) => {
    if (formik.values.gender === gender) {
      formik.setFieldValue("gender", null);
    } else {
      formik.setFieldValue("gender", gender);
    }
  };

  useEffect(() => {
    formik.setFieldValue("idToken", idToken);
  }, [idToken]);

  useEffect(() => {
    const { username, gender, birthdayDate } = formik.values;

    const hasEmptyUsername = !username || !checkEmptyString(username);
    const hasEmptyGender = !gender;
    const hasEmptyDate = !birthdayDate;

    const shouldDisable =
      hasEmptyUsername ||
      hasEmptyGender ||
      hasEmptyDate ||
      LOADING_GOOGLE_SIGNUP;

    setIsDisabled(shouldDisable);
  }, [formik.values, LOADING_GOOGLE_SIGNUP]);

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-8">
          <Spinner size={50} style={{ color: "var(--primary-color)" }} />

          <p className="font-semibold lg:text-xl text-lg text-(--text-primary)">
            {t("common.checking_email")}
          </p>
        </div>
      ) : (
        <div
          className="relative w-full max-w-[480px] rounded-[32px] border border-(--input-border) bg-(--auth-main-bg) p-8 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={onKeyDown}
        >
          {/* Glow Effects (Background Decorations) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-(--primary-color)/10 blur-[60px] rounded-full pointer-events-none" />

          {/* Header Section */}
          <div className="relative z-10 flex flex-col items-center text-center mb-8">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-(--input-border) bg-(--auth-main-bg) text-(--primary-color) shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)]">
              <span className="material-symbols-outlined">how_to_reg</span>
            </div>

            <h2 className="text-2xl font-bold text-(--text-primary) mb-2">
              {t("common.complete_signup")}
            </h2>
            <p className="text-(--muted-color) text-sm max-w-[80%] leading-relaxed">
              {t("common.google_signup_description")}
            </p>
          </div>

          {/* Form Content */}
          <form
            className="relative z-10 flex flex-col gap-5"
            onSubmit={formik.handleSubmit}
          >
            {/* Username Input */}
            <Input
              type="text"
              name="username"
              value={formik.values.username || ""}
              onChange={(e) => {
                const value = e.target.value || null;
                if (value && value.length > 30) return;
                formik.setFieldValue("username", value || null);
              }}
              onBlur={() => formik.setFieldTouched("username", true, false)}
              title={t("common.username")}
              icon={<span className="material-symbols-outlined">person</span>}
              maxLength={30}
            />

            {/* Date Picker */}
            <CustomDatePicker
              value={formik.values.birthdayDate}
              onChange={(date) => formik.setFieldValue("birthdayDate", date)}
              placeholder={t("common.birthday") || "DOĞUM TARİXİ"}
            />

            {/* Gender Selector */}
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

            {/* Footer Actions */}
            <div className="mt-4 flex gap-3">
              <Button
                type="button"
                onClick={onClose}
                disabled={LOADING_GOOGLE_SIGNUP}
                title={t("common.cancel")}
                className="flex-1 rounded-xl bg-(--bg-color) px-6 py-4 text-sm font-semibold text-(--text-primary) transition-all active:scale-[0.98] duration-100"
              />
              <Button
                disabled={isDisabled}
                isLoading={LOADING_GOOGLE_SIGNUP}
                title={t("common.complete_signup")}
                type="submit"
                className="flex-1 rounded-xl bg-(--primary-color) px-6 py-4 text-sm font-semibold text-[#050b08] shadow-[0_4px_20px_-5px_rgba(52,211,153,0.4)] transition-all duration-200 active:scale-[0.98]"
              />
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default SignupModal;
