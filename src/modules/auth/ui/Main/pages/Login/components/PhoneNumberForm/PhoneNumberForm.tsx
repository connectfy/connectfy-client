import PhoneNumber from "@/components/Form/PhoneNumberForm/PhoneNumberForm";
import "./phoneNumberForm.style.css";
import { useTranslation } from "react-i18next";
import PasswordInput from "@/components/ui/CustomInput/PasswordInput/PasswordInput.tsx";
import Button from "@/components/Buttons/Button/Button";
import { FormikProps } from "formik";
import { ILoginForm, IPhoneNumber } from "../../../../../../types/types";
import { FC } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { RESOURCE } from "@/common/enums/enums";
import Spinner from "@/components/Spinner/Spinner";

interface Props {
  formik: FormikProps<ILoginForm>;
  isDisabled: boolean;
}

const PhoneNumberForm: FC<Props> = ({ formik, isDisabled }) => {
  const { t } = useTranslation();
  const { LOADING_LOGIN } = useAppSelector((state) => state[RESOURCE.AUTH]);

  return (
    <div className="phoneNumber-login-form">
      <div className="phoneNumber-login-form-inputs">
        <PhoneNumber
          name="identifier"
          onBlur={() => formik.setFieldTouched("identifier", true, false)}
          onChange={(value: IPhoneNumber | null) =>
            formik.setFieldValue("identifier", value?.fullPhoneNumber || null)
          }
          blur={formik.touched.identifier ?? false}
        />
        <PasswordInput
          inputSize="medium"
          title={t("common.password")}
          name="password"
          value={formik.values.password || ""}
          onChange={(e) => {
            const value = e.target.value || null;

            if (value && value.length > 30) return;

            formik.setFieldValue("password", value || null);
          }}
          onBlur={() => formik.setFieldTouched("password", true, false)}
        />
      </div>
      <div className="phoneNumber-login-form-submit">
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

export default PhoneNumberForm;
