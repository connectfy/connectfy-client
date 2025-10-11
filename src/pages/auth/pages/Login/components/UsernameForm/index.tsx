import Input from "@/components/Input/Input";
import "./index.style.css";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button/Button";

const UsernameForm = () => {
  const { t } = useTranslation();

  return (
    <div className="username-login-form">
      <div className="username-login-form-inputs">
        <Input inputSize="medium" label={t("common.username")} />
        <PasswordInput inputSize="medium" label={t("common.password")} />
      </div>
      <div className="username-login-form-submit">
        <Button fillWidth size="small" hasAnimation>
          {t("common.login")}
        </Button>
      </div>
    </div>
  );
};

export default UsernameForm;
