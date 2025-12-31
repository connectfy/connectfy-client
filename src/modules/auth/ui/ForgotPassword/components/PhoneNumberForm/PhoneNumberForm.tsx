import "./phoneNumberForm.style.css";
import Button from "@/components/Buttons/Button/Button";
import PhoneNumber from "@/components/Form/PhoneNumberForm/PhoneNumberForm";
import Spinner from "@/components/Spinner/Spinner";
import { useAppSelector } from "@/hooks/useStore";
import { IForgotPasswordForm, IPhoneNumber } from "../../../../types/types";
import { RESOURCE } from "@/common/enums/enums";
import { FormikProps } from "formik";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  formik: FormikProps<IForgotPasswordForm>;
  isDisabled: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
}

const PhoneNumberForm: FC<Props> = ({ formik, isDisabled, onKeyDown }) => {
  const { t } = useTranslation();

  const { LOADING_FORGOT_PASSWORD } = useAppSelector(
    (state) => state[RESOURCE.AUTH]
  );

  return (
    <div className="forgot-password-phone-number-form">
      <PhoneNumber
        name="identifier"
        onBlur={() => formik.setFieldTouched("identifier", true, false)}
        onChange={(value: IPhoneNumber | null) =>
          formik.setFieldValue("identifier", value?.fullPhoneNumber || null)
        }
        blur={formik.touched.identifier ?? false}
        onKeyDown={(e) => onKeyDown(e)}
      />
      <div className="forgot-password-phone-number-form-submit">
        <Button
          fillWidth
          hasAnimation
          onClick={() => formik.handleSubmit()}
          disabled={isDisabled}
          type="button"
        >
          {LOADING_FORGOT_PASSWORD ? <Spinner /> : t("common.submit")}
        </Button>
      </div>
    </div>
  );
};

export default PhoneNumberForm;
