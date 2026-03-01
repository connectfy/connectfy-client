import "./genderForm.style.css";
import { useTranslation } from "react-i18next";
import { GENDER } from "@/common/enums/enums";
import { FormikProps } from "formik";
import { IGoogleSignupForm, ISignupForm } from "@/modules/auth/types/types";
import { FC, useCallback } from "react";
import Input from "@/components/ui/CustomInput/Input/Input";

interface Props {
  formik: FormikProps<ISignupForm> | FormikProps<IGoogleSignupForm>;
  formId?: string;
}

const GenderForm: FC<Props> = ({ formik, formId = "default" }) => {
  const { t } = useTranslation();

  const changeGender = useCallback(
    (value: GENDER) => {
      if (formik.values.gender === value) formik.setFieldValue("gender", null);
      else formik.setFieldValue("gender", value);
    },
    [formik],
  );

  return (
    <div className="gender-group">
      <Input
        autoComplete="off"
        type="radio"
        id={`male-${formId}`}
        name={`gender-${formId}`}
        value={GENDER.MALE}
        checked={formik.values.gender === GENDER.MALE}
        onClick={() => changeGender(GENDER.MALE)}
        onChange={() => {}}
      />
      <label htmlFor={`male-${formId}`}>{t("enum.male")}</label>

      <Input
        autoComplete="off"
        type="radio"
        id={`female-${formId}`}
        name={`gender-${formId}`}
        value={GENDER.FEMALE}
        checked={formik.values.gender === GENDER.FEMALE}
        onClick={() => changeGender(GENDER.FEMALE)}
        onChange={() => {}}
      />
      <label htmlFor={`female-${formId}`}>{t("enum.female")}</label>

      <Input
        autoComplete="off"
        type="radio"
        id={`other-${formId}`}
        name={`gender-${formId}`}
        value={GENDER.OTHER}
        checked={formik.values.gender === GENDER.OTHER}
        onClick={() => changeGender(GENDER.OTHER)}
        onChange={() => {}}
      />
      <label htmlFor={`other-${formId}`}>{t("enum.other")}</label>
    </div>
  );
};

export default GenderForm;
