import { FC } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  ListChecks,
  ArrowUpDown,
  Copy,
  ExternalLink,
} from "lucide-react";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useTranslation } from "react-i18next";

interface ContextMenuProps {
  onEdit: () => void;
  onRemove: () => void;
  onSelect: () => void;
  onReorder: () => void;
  onCopy: () => void;
  onClose: () => void;
  onOpenLink: () => void;
}

const SocialContextMenu: FC<ContextMenuProps> = ({
  onEdit,
  onRemove,
  onSelect,
  onReorder,
  onCopy,
  onClose,
  onOpenLink,
}) => {
  const { t } = useTranslation();

  const MenuItem = ({
    icon: Icon,
    label,
    onClick,
    isDelete = false,
  }: {
    icon: any;
    label: string;
    onClick: () => void;
    isDelete?: boolean;
  }) => (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        onClose();
      }}
      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-white/5 first:rounded-t-xl last:rounded-b-xl
        ${isDelete ? "text-red-500" : "text-zinc-200"}`}
    >
      <span className="font-medium">{label}</span>
      <Icon size={18} className={isDelete ? "text-red-500" : "text-zinc-400"} />
    </Button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex flex-col min-w-[220px] bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
    >
      <MenuItem
        icon={ExternalLink}
        label={t("common.open")}
        onClick={onOpenLink}
      />
      <MenuItem icon={Copy} label={t("common.copy")} onClick={onCopy} />
      <MenuItem icon={Pencil} label={t("common.edit")} onClick={onEdit} />

      {/* Şəkildəki separator xətti */}
      <div className="h-px bg-white/5 mx-2" />

      <MenuItem
        icon={ListChecks}
        label={t("common.select")}
        onClick={onSelect}
      />
      <MenuItem
        icon={ArrowUpDown}
        label={t("common.reorder")}
        onClick={onReorder}
      />

      <div className="h-px bg-white/5 mx-2" />

      <MenuItem
        icon={Trash2}
        label={t("common.remove")}
        onClick={onRemove}
        isDelete
      />
    </motion.div>
  );
};

export default SocialContextMenu;
