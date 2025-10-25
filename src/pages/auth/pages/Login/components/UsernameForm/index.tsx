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
import { onPressEnter } from "@/utils/keyPressDown";

interface Props {
  formik: FormikProps<ILoginForm>;
  isDisabled: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
}

const UsernameForm: FC<Props> = ({ formik, isDisabled, onKeyDown }) => {
  const { t } = useTranslation();
  const { LOADING_LOGIN } = useAppSelector((state) => state[Resource.auth]);

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
          onKeyDown={(e) => onKeyDown(e)}
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
          onKeyDown={(e) => onKeyDown(e)}
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
          onKeyDown={(e) =>
            onPressEnter(e, () => {
              if (isDisabled) return;
              formik.handleSubmit();
            })
          }
        >
          {LOADING_LOGIN ? <Spinner /> : t("common.login")}
        </Button>
      </div>
    </div>
  );
};

export default UsernameForm;
