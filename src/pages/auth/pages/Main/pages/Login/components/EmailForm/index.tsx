import Input from "@/components/Input/Input";
import "./index.style.css";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button/Button";
import { FormikProps } from "formik";
import { ILoginForm } from "@/types/auth/auth.type";
import { FC } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { Resource } from "@/types/enum.types";
import Spinner from "@/components/Spinner/Spinner";

interface Props {
  formik: FormikProps<ILoginForm>;
  isDisabled: boolean;
}

const EmailForm: FC<Props> = ({ formik, isDisabled }) => {
  const { t } = useTranslation();
  const { LOADING_LOGIN } = useAppSelector((state) => state[Resource.auth]);

  return (
    <div className="email-login-form">
      <div className="email-login-form-inputs">
        <Input
          inputSize="medium"
          label={t("common.email")}
          name="identifier"
          value={formik.values.identifier || ""}
          onChange={(e) =>
            formik.setFieldValue("identifier", e.target.value || null)
          }
          onBlur={() => formik.setFieldTouched("identifier", true, false)}
          hasError={!!(formik.errors.identifier && formik.touched.identifier)}
        />
        <PasswordInput
          inputSize="medium"
          label={t("common.password")}
          name="password"
          value={formik.values.password || ""}
          onChange={(e) =>
            formik.setFieldValue("password", e.target.value || "")
          }
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
