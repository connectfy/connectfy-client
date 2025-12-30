import PhoneNumber from "@/components/Form/PhoneNumberForm";
import "./phoneNumberForm.style.css";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button/Button";
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
          label={t("common.password")}
          name="password"
          value={formik.values.password || ""}
          onChange={(e) =>
            formik.setFieldValue("password", e.target.value || null)
          }
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
