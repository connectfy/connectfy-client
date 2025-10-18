import "./index.style.css";
import Input from "@/components/Input/Input";
import { useTranslation } from "react-i18next";
import PhoneNumberForm from "@/components/Form/PhoneNumberForm";
import GenderForm from "./components/GenderForm";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import { Link } from "react-router-dom";
import Button from "@/components/Button/Button";
import { useDispatch } from "react-redux";
import { setAuthForm } from "@/features/auth/authSlice";
import DatePicker from "@/components/DatePicker";
import { useState } from "react";

const Signup = () => {
  const [birthday, setBirthday] = useState<string>("");
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div className="signup-form">
      <div className="signup-form-block">
        <Input inputSize="medium" label={t("common.first_name")} />
        <Input inputSize="medium" label={t("common.last_name")} />
      </div>
      <div className="signup-form-block">
        <Input inputSize="medium" label={t("common.username")} />
        <Input inputSize="medium" label={t("common.email")} />
      </div>
      <div className="signup-form-block">
        <PhoneNumberForm />
      </div>
      <div className="signup-form-block">
        <DatePicker
          value={birthday}
          onChange={(date) => setBirthday(date)}
          inputSize="small"
          hasError={false}
          placeholder={t('common.birthday')}
        />
      </div>
      <div className="signup-form-block">
        <GenderForm />
      </div>
      <div className="signup-form-block-password">
        <PasswordInput
          inputSize="medium"
          label={t("common.password")}
          showGenerateIcon
        />
        <PasswordInput
          inputSize="medium"
          label={t("common.confirm_password")}
        />
      </div>

      <div className="terms-conditions">
        <input
          autoComplete="off"
          type="checkbox"
          id="terms"
          name="terms"
          className="custom-checkbox"
        />
        <label htmlFor="terms">
          {t("common.terms_prefix")}{" "}
          <Link to={"/terms"} className="terms-link">
            {t("common.terms_link")}
          </Link>{" "}
          {t("common.terms_suffix")}
        </label>
      </div>

      <Button
        fillWidth
        size="small"
        hasAnimation
        onClick={() => dispatch(setAuthForm("verify"))}
      >
        {t("common.signup")}
      </Button>
    </div>
  );
};

export default Signup;
