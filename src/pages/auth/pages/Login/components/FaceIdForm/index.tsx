import Input from "@/components/Input/Input";
import "./index.style.css";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button/Button";
import { FormikProps } from "formik";
import { ILoginForm } from "@/types/auth/auth.type";
import { FC } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { Resource } from "@/types/enum.types";
import Spinner from "@/components/Spinner/Spinner";
import { checkEmptyString } from "@/utils/checkValues";

interface Props {
  formik: FormikProps<ILoginForm>;
}

const FaceIdForm: FC<Props> = ({ formik }) => {
  const { t } = useTranslation();

  const { LOADING_LOGIN } = useAppSelector((state) => state[Resource.auth]);

  return (
    <div className="faceId-login-form">
      <div className="faceId-login-form-inputs">
        <Input
          inputSize="medium"
          label={t("common.username")}
          name="identifier"
          value={formik.values.identifier || ""}
          onChange={(e) =>
            formik.setFieldValue("identifier", e.target.value || null)
          }
          onBlur={() => formik.setFieldTouched("identifier", true, false)}
        />
      </div>
      <div className="faceId-login-form-submit">
        <Button
          fillWidth
          size="small"
          hasAnimation
          onClick={() => formik.handleSubmit()}
          disabled={
            !formik.values.identifier ||
            !checkEmptyString(formik.values.identifier) ||
            LOADING_LOGIN
          }
          type="button"
        >
          {LOADING_LOGIN ? <Spinner /> : t("common.login")}
        </Button>
      </div>
    </div>
  );
};

export default FaceIdForm;
