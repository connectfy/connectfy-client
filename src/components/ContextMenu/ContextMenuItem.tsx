import { useContextMenu } from "@/hooks/useContextMenu";
import { FC } from "react";
import Button from "../ui/CustomButton/Button/Button";

interface IProps {
  icon?: any;
  label: string | React.ReactNode;
  onClick: () => void;
  isWarning?: boolean;
  closeAfterClick?: boolean;
  className?: string;
  labelClassName?: string;
  iconClassName?: string;
}

const ContextMenuItem: FC<IProps> = ({
  icon: Icon,
  label,
  onClick,
  isWarning,
  closeAfterClick = false,
  className,
  labelClassName,
  iconClassName,
}) => {
  const { closeMenu } = useContextMenu();

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        if (closeAfterClick) closeMenu();
      }}
      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-white/80 dark:hover:bg-white/5 first:rounded-t-xl last:rounded-b-xl duration-300
        ${isWarning ? "text-red-500" : "text-(--text-color)"} ${className}`}
    >
      <span className={`font-medium ${labelClassName}`}>{label}</span>
      {Icon && (
        <Icon
          size={18}
          className={`${isWarning ? "text-red-500" : "text-(--text-color)"} ${iconClassName}`}
        />
      )}
    </Button>
  );
};

export default ContextMenuItem;
