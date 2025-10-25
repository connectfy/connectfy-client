import "./index.style.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useTranslation } from "react-i18next";
import { FormikProps } from "formik";
import { IForgotPasswordForm } from "@/types/auth/auth.type";
import { FC } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { Resource } from "@/types/enum.types";
import Spinner from "@/components/Spinner/Spinner";

interface Props {
  formik: FormikProps<IForgotPasswordForm>;
  isDisabled: boolean;
}

const EmailForm: FC<Props> = ({ formik, isDisabled }) => {
  const { t } = useTranslation();

  const { LOADING_FORGOT_PASSWORD } = useAppSelector(
    (state) => state[Resource.auth]
  );

  return (
    <div className="forgot-password-email-form">
      <div className="forgot-password-email-form-inputs">
        <Input
          inputSize="medium"
          label={t("common.email")}
          name="identifier"
          value={formik.values.identifier || ""}
          onChange={(e) =>
            formik.setFieldValue("identifier", e.target.value || null)
          }
          onBlur={() => formik.setFieldTouched("identifier", true, false)}
        />
      </div>
      <div className="forgot-password-email-form-submit">
        <Button
          fillWidth
          hasAnimation
          disabled={isDisabled}
          onClick={() => formik.handleSubmit()}
          type="button"
        >
          {LOADING_FORGOT_PASSWORD ? <Spinner /> : t("common.submit")}
        </Button>
      </div>
    </div>
  );
};

export default EmailForm;
