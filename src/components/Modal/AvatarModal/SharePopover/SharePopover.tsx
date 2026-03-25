import { FC, useRef } from "react";
import { Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickAway } from "react-use";
import { useShare } from "@/hooks/useShare";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useTranslation } from "react-i18next";
import TextTooltip from "@/components/Tooltip/TextTooltip";

interface IProps {
  profileUrl: string;
  username?: string;
}

const SharePopover: FC<IProps> = ({ profileUrl, username }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const { isOpen, setIsOpen, shareLinks, handleOpen } = useShare({
    url: profileUrl,
    text: `${t("common.check_out_my_profile")}:`,
    title: username,
  });

  useClickAway(ref, () => setIsOpen(false));

  return (
    <div className="relative" ref={ref}>
      <TextTooltip position="top" text={t("common.share")}>
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-[90px] flex flex-col items-center gap-1.5 transition-colors text-(--text-secondary) hover:text-(--third-color) group"
        >
          <div className="p-3 rounded-2xl bg-(--active-bg-2) group-hover:bg-(--active-bg) transition-colors">
            <Share2 size={22} />
          </div>
          {/* <span className="text-[11px] font-semibold tracking-wider">
            {t("common.share")}
          </span> */}
        </Button>
      </TextTooltip>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50
                       bg-(--auth-main-bg) border border-(--auth-glass-border)
                       rounded-2xl shadow-xl p-2 flex flex-col gap-1 min-w-[160px]"
          >
            {shareLinks.map(({ label, icon, href }) => (
              <Button
                key={label}
                onClick={() => handleOpen(href)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                           hover:bg-(--active-bg) transition-colors text-sm
                           text-(--text-secondary) hover:text-(--third-color) w-full text-left font-semibold"
              >
                {icon}
                {label}
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SharePopover;
