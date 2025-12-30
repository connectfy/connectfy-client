import "./emailForm.style.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useTranslation } from "react-i18next";
import { FormikProps } from "formik";
import { IForgotPasswordForm } from "../../../../types/types";
import { FC } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { RESOURCE } from "@/common/enums/enums";
import Spinner from "@/components/Spinner/Spinner";

interface Props {
  formik: FormikProps<IForgotPasswordForm>;
  isDisabled: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
}

const EmailForm: FC<Props> = ({ formik, isDisabled, onKeyDown }) => {
  const { t } = useTranslation();

  const { LOADING_FORGOT_PASSWORD } = useAppSelector(
    (state) => state[RESOURCE.AUTH]
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
          onKeyDown={(e) => onKeyDown(e)}
          hasError={!!(formik.errors.identifier && formik.touched.identifier)}
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
