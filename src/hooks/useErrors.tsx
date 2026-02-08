import { snack } from "@/common/utils/snackManager";

export const useErrors = () => {
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

  return {
    showResponseErrors,
  };
};
