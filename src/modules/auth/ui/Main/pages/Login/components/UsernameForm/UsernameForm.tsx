import "./usernameForm.style.css";
import Input from "@/components/ui/CustomInput/Input/Input.tsx";
import PasswordInput from "@/components/ui/CustomInput/PasswordInput/PasswordInput.tsx";
import { useTranslation } from "react-i18next";
import Button from "@/components/Buttons/Button/Button";
import { FormikProps } from "formik";
import { ILoginForm } from "../../../../../../types/types";
import { FC } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { RESOURCE } from "@/common/enums/enums";
import Spinner from "@/components/Spinner/Spinner";
import { User } from "lucide-react";

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
          icon={<User />}
          title={t("common.username")}
          name="identifier"
          value={formik.values.identifier || ""}
          onChange={(e) => {
            const value = e.target.value || null;

            if (value && value.length > 30) return;

            formik.setFieldValue("identifier", value || null);
          }}
          onBlur={() => formik.setFieldTouched("identifier", true, false)}
          isError={!!(formik.errors.identifier && formik.touched.identifier)}
        />
        <PasswordInput
          showGenerateButton={true}
          title={t("common.password")}
          name="password"
          value={formik.values.password || ""}
          onChange={(e) => {
            const value = e.target.value || null;

            if (value && value.length > 30) return;

            formik.setFieldValue("password", e.target.value || null);
          }}
          onBlur={() => formik.setFieldTouched("password", true, false)}
          isError={!!(formik.errors.password && formik.touched.password)}
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
