import { useEffect, useState } from "react";
import { FormikProps } from "formik";

type ValidationRule<T = any> = boolean | ((values: T) => boolean);

interface UseFormDisabledConfig<T = any> {
  formik: FormikProps<T>;
  loading?: boolean;
  validationRules: ValidationRule<T>[];
}

const useFormDisabled = <T = any>(
  config: UseFormDisabledConfig<T>
): boolean => {
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const { formik, loading, validationRules } = config;

    if (loading) {
      setIsDisabled(true);
      return;
    }

    const isValid = validationRules.every((rule) => {
      if (typeof rule === "function") {
        return rule(formik.values);
      }
      return rule;
    });

    setIsDisabled(!isValid);
  }, [config.formik.values, config.loading, config.validationRules]);

  return isDisabled;
};

export default useFormDisabled;
