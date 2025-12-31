import Input from "@/components/Input/Input";
import "./index.style.css";
import { useTranslation } from "react-i18next";
import Button from "@/components/Buttons/Button/Button";
import { FormikProps } from "formik";
import { ILoginForm } from "../../../../../../types/types";
import { FC, Fragment } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { RESOURCE } from "@/common/enums/enums";
import Spinner from "@/components/Spinner/Spinner";
import { checkEmptyString } from "@/common/utils/checkValues";
import FaceIdModal from "@/components/Modal/FaceIdModal";

interface Props {
  formik: FormikProps<ILoginForm>;
  isDisabled: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  // onToggle: () => void;
}

const FaceIdForm: FC<Props> = ({
  formik,
  isDisabled,
  open,
  onOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const { LOADING_LOGIN } = useAppSelector((state) => state[RESOURCE.AUTH]);

  return (
    <Fragment>
      <div className="faceId-login-form">
        <div className="faceId-login-form-inputs">
          <Input
            inputSize="medium"
            label={t("common.username")}
            name="identifier"
            value={formik.values.identifier || ""}
            onChange={(e) => {
              const value = e.target.value || null;

              if (value && value.length > 30) return;

              formik.setFieldValue("identifier", value || null);
            }}
            onBlur={() => formik.setFieldTouched("identifier", true, false)}
            hasError={!!(formik.errors.identifier && formik.touched.identifier)}
          />
        </div>
        <div className="faceId-login-form-submit">
          <Button
            fillWidth
            size="small"
            hasAnimation
            onClick={onOpen}
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

      <FaceIdModal
        isOpen={open}
        onClose={onClose}
        mode="login"
        formik={formik}
        isDisabled={isDisabled}
      />
    </Fragment>
  );
};

export default FaceIdForm;
