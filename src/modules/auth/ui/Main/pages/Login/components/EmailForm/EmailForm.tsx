import Input from "@/components/Input/Input";
import "./emailForm.style.css";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button/Button";
import { FormikProps } from "formik";
import { ILoginForm } from "../../../../../../types/types";
import { FC } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { RESOURCE } from "@/common/enums/enums";
import Spinner from "@/components/Spinner/Spinner";

interface Props {
  formik: FormikProps<ILoginForm>;
  isDisabled: boolean;
}

const EmailForm: FC<Props> = ({ formik, isDisabled }) => {
  const { t } = useTranslation();
  const { LOADING_LOGIN } = useAppSelector((state) => state[RESOURCE.AUTH]);

  return (
    <div className="email-login-form">
      <div className="email-login-form-inputs">
        <Input
          inputSize="medium"
          label={t("common.email")}
          name="identifier"
          value={formik.values.identifier || ""}
          onChange={(e) =>{
            const value = e.target.value || null;

            if (value && value.length > 254) return;

            formik.setFieldValue("identifier", value || null)
          }}
          onBlur={() => formik.setFieldTouched("identifier", true, false)}
          hasError={!!(formik.errors.identifier && formik.touched.identifier)}
        />
        <PasswordInput
          inputSize="medium"
          label={t("common.password")}
          name="password"
          value={formik.values.password || ""}
          onChange={(e) =>{
            const value = e.target.value || null;

            if (value && value.length > 30) return;

            formik.setFieldValue("password", value || "")
          }}
          onBlur={() => formik.setFieldTouched("password", true, false)}
          hasError={!!(formik.errors.password && formik.touched.password)}
        />
      </div>
      <div className="email-login-form-submit">
        <Button
          fillWidth
          size="small"
          hasAnimation
          onClick={() => formik.handleSubmit()}
          disabled={isDisabled}
          type="button"
        >
          {LOADING_LOGIN ? <Spinner /> : t("common.login")}
        </Button>
      </div>
    </div>
  );
};

export default EmailForm;
