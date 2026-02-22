import toast from "react-hot-toast";
import Button from "../CustomButton/Button/Button";

type ToastType = "success" | "error" | "warning" | "info" | "default";

const CONFIG: Record<
  ToastType,
  { icon: string; bar: string; iconClass: string }
> = {
  success: {
    icon: "check_circle",
    bar: "bg-(--primary-color)",
    iconClass: "text-(--primary-color)",
  },
  error: {
    icon: "error", // və ya "cancel"
    bar: "bg-(--error-color)",
    iconClass: "text-(--error-color)",
  },
  warning: {
    icon: "warning",
    bar: "bg-amber-400",
    iconClass: "text-amber-400",
  },
  info: {
    icon: "info",
    bar: "bg-blue-400",
    iconClass: "text-blue-400",
  },
  default: {
    icon: "notifications",
    bar: "bg-(--muted-color)",
    iconClass: "text-(--muted-color)",
  },
};

type Props = {
  toastId: string;
  message: string;
  type: ToastType;
  visible: boolean;
};

const CustomToast = ({ toastId, message, type, visible }: Props) => {
  const { icon, bar, iconClass } = CONFIG[type];

  return (
    <div
      className={`
        relative flex items-center gap-3
        min-w-[280px] max-w-[420px]
        bg-(--card-bg) text-(--text-color)
        rounded-xl overflow-hidden
        shadow-(--card-shadow)
        border border-(--input-border)
        px-4 py-3
        transition-all duration-300 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      {/* Left accent bar */}
      <span className={`absolute left-0 top-0 h-full w-[3px] ${bar}`} />

      {/* Google Font Icon */}
      <span
        className={`material-symbols-outlined shrink-0 text-[20px] ${iconClass}`}
        aria-hidden="true"
      >
        {icon}
      </span>

      {/* Message (Responsive text size for desktop) */}
      <p className="flex-1 text-sm md:text-base leading-snug">{message}</p>

      {/* Close */}
      <Button
        onClick={() => toast.dismiss(toastId)}
        className="
          shrink-0 p-1 flex items-center justify-center rounded-md
          text-(--muted-color)
          hover:bg-(--active-bg)
          hover:text-(--text-color)
          transition-colors duration-150
        "
        aria-label="Close"
        icon={
          <span className="material-symbols-outlined text-[16px]">close</span>
        }
      />
    </div>
  );
};

export default CustomToast;
