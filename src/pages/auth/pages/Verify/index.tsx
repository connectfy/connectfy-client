import Button from "@/components/Button/Button";
import OTPForm from "./components/OTPForm";
import "./index.style.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Resource } from "@/types/enum.types";
import { KeyboardBackspace } from "@mui/icons-material";
import { setAuthForm } from "@/features/auth/authSlice";

const VerifyAccount = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { signupForm } = useSelector(
    (state: RootState) => state[Resource.auth]
  );

  return (
    <div className="verify-account">
      <div className="verify-account-message">
        <h3>{t("common.verify_account_heading")}</h3>
        <p>
          {t("common.verify_account_message_part_1")}{" "}
          <span className="highlight-email">
            {signupForm.email ?? "example@gmail.com"}
          </span>
          . {t("common.verify_account_message_part_2")}
        </p>
      </div>

      <div className="verify-account-form">
        <OTPForm length={6} />

        <div className="verify-account-buttons">
          <Button fillWidth hasAnimation>
            {t("common.verify")}
          </Button>

          <div
            className="verify-account-button"
            onClick={() => dispatch(setAuthForm("signup"))}
          >
            <KeyboardBackspace
              fontSize="small"
              style={{ color: "var(--primary-color)" }}
            />
            <div>{t("common.back")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
