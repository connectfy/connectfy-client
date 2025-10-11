import Input from "@/components/Input/Input";
import "./index.style.css";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button/Button";

const FaceIdForm = () => {
  const { t } = useTranslation();

  return (
    <div className="faceId-login-form">
      <div className="faceId-login-form-inputs">
        <Input inputSize="medium" label={t("common.username")} />
      </div>
      <div className="faceId-login-form-submit">
        <Button fillWidth size="small" hasAnimation>
          {t("common.login")}
        </Button>
      </div>
    </div>
  );
};

export default FaceIdForm;
