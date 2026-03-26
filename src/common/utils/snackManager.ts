import toast, { ToastPosition } from "react-hot-toast";
import CustomToast from "@/components/ui/CustomToast/CustomToast";
import { useIsMobile } from "@/hooks/useIsMobile";

type ToastType = "success" | "error" | "warning" | "info" | "default";
type SnackOptions = {
  duration?: number;
  position?: ToastPosition;
};

const isMobile = useIsMobile();
const getPosition = (position?: ToastPosition) => {
  if (position) return position;
  return isMobile ? "bottom-center" : "bottom-right";
};

const show = (message: string, type: ToastType, options: SnackOptions = {}) => {
  toast.custom(
    (t) =>
      CustomToast({
        toastId: t.id,
        message,
        type,
        visible: t.visible,
      }),
    {
      duration: options.duration ?? 3000,
      position: getPosition(options.position),
    },
  );
};

export const snack = {
  show: (message: string, options?: SnackOptions) =>
    show(message, "default", options),
  success: (message: string, options?: SnackOptions) =>
    show(message, "success", options),
  error: (message: string, options?: SnackOptions) =>
    show(message, "error", options),
  warning: (message: string, options?: SnackOptions) =>
    show(message, "warning", options),
  info: (message: string, options?: SnackOptions) =>
    show(message, "info", options),
};
