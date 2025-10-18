import "./index.style.css";
import Button from "@/components/Button/Button";
import PhoneNumber from "@components/Form/PhoneNumberForm";
import { useTranslation } from "react-i18next";

const PhoneNumberForm = () => {
  const { t } = useTranslation();

  return (
    <div className="forgot-password-phone-number-form">
      <PhoneNumber />
      <div className="forgot-password-phone-number-form-submit">
        <Button fillWidth hasAnimation>
          {t("common.submit")}
        </Button>
      </div>
    </div>
  );
};

export default PhoneNumberForm;
