import { snack } from "@/common/utils/snackManager";
import { FormikErrors } from "formik";

export const useErrors = () => {
  // ================================
  // Api error messages handler
  // ================================
  const showResponseErrors = (error: any) => {
    if (error.message) {
      if (Array.isArray(error.message)) {
        error.message.forEach((err: string) => {
          snack.error(err, { autoHideDuration: 5000 });
        });
      } else {
        snack.error(error.message, { autoHideDuration: 5000 });
      }
    }
  };

  // ================================
  // Formik errors handler
  // ================================
  const extract = (obj: any) => {
    if (!obj) return;

    if (typeof obj === "string") {
      snack.warning(obj, { autoHideDuration: 5000, size: "large" });
      return;
    }

    Object.values(obj).forEach((value) => extract(value));
  };

  const showFormikErrors = (errors: FormikErrors<any>) => {
    extract(errors);
  };
  return {
    showResponseErrors,
    showFormikErrors,
  };
};
