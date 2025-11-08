import { SnackbarOrigin, VariantType, enqueueSnackbar } from "notistack";

type SnackOptions = {
  variant?: VariantType;
  autoHideDuration?: number;
  anchorOrigin?: SnackbarOrigin;
  size?: "small" | "medium" | "large";
};

export const snack = {
  show: (message: string, options: SnackOptions = {}) => {
    const size = options.size ?? "large";

    enqueueSnackbar(message, {
      variant: options.variant ?? "default",
      autoHideDuration: options.autoHideDuration ?? 4000,
      anchorOrigin: options.anchorOrigin ?? {
        vertical: "bottom",
        horizontal: "right",
      },
      className: `snackbar-${size}`,
    });
  },

  success: (message: string, options: Omit<SnackOptions, "variant"> = {}) => {
    snack.show(message, { ...options, variant: "success" });
  },

  error: (message: string, options: Omit<SnackOptions, "variant"> = {}) => {
    snack.show(message, { ...options, variant: "error" });
  },

  warning: (message: string, options: Omit<SnackOptions, "variant"> = {}) => {
    snack.show(message, { ...options, variant: "warning" });
  },

  info: (message: string, options: Omit<SnackOptions, "variant"> = {}) => {
    snack.show(message, { ...options, variant: "info" });
  },
};
