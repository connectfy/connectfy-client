import Input from "@/components/Input/Input";
import "./usernameForm.style.css";
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

const UsernameForm: FC<Props> = ({ formik, isDisabled }) => {
  const { t } = useTranslation();
  const { LOADING_LOGIN } = useAppSelector((state) => state[RESOURCE.AUTH]);

  return (
    <div className="username-login-form">
      <div className="username-login-form-inputs">
        <Input
          inputSize="medium"
          label={t("common.username")}
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
            formik.setFieldValue("password", e.target.value || null)
          }
          onBlur={() => formik.setFieldTouched("password", true, false)}
          hasError={!!(formik.errors.password && formik.touched.password)}
        />
      </div>
      <div className="username-login-form-submit">
        <Button
          fillWidth
          size="small"
          hasAnimation
          disabled={isDisabled}
          onClick={() => formik.handleSubmit()}
          type="button"
        >
          {LOADING_LOGIN ? <Spinner /> : t("common.login")}
        </Button>
      </div>
    </div>
  );
};

export default UsernameForm;
