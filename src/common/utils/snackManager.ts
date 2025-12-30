import { SnackbarOrigin, VariantType, enqueueSnackbar } from "notistack";

type SnackOptions = {
  variant?: VariantType;
  autoHideDuration?: number;
  anchorOrigin?: SnackbarOrigin;
  size?: "small" | "medium" | "large";
};

const isMobile = () => window.innerWidth < 768;

const getAnchorOrigin = (customOrigin?: SnackbarOrigin): SnackbarOrigin => {
  if (customOrigin && !isMobile()) {
    return customOrigin;
  }

  return isMobile()
    ? { vertical: "bottom", horizontal: "center" }
    : { vertical: "bottom", horizontal: "right" };
};

export const snack = {
  show: (message: string, options: SnackOptions = {}) => {
    const size = options.size ?? "large";

    enqueueSnackbar(message, {
      variant: options.variant ?? "default",
      autoHideDuration: options.autoHideDuration ?? 4000,
      anchorOrigin: getAnchorOrigin(options.anchorOrigin),
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