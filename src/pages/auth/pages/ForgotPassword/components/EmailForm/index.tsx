import "./index.style.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useTranslation } from "react-i18next";

const EmailForm = () => {
  const { t } = useTranslation();

  return (
    <div className="forgot-password-email-form">
      <div className="forgot-password-email-form-inputs">
        <Input inputSize="medium" label={t("common.email")} />
      </div>
      <div className="forgot-password-email-form-submit">
        <Button fillWidth hasAnimation>
          {t("common.submit")}
        </Button>
      </div>
    </div>
  );
};

export default EmailForm;
