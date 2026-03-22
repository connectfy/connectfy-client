import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/CustomButton/Button/Button";
import { ArrowLeft, Save } from "lucide-react";

interface Props {
  onClickBack: () => void;
  headerTitle: string;
  headerSubtitle: string;
  showHeaderButton?: boolean;
  isHeaderButtonDisabled?: boolean;
  onHeaderButtonClick?: () => void;
  isLoading?: boolean;
}

const UniqueHeader: FC<Props> = ({
  onClickBack,
  headerTitle,
  headerSubtitle,
  showHeaderButton = false,
  isHeaderButtonDisabled = true,
  onHeaderButtonClick,
  isLoading,
}) => {
  const { t } = useTranslation();
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={headerRef}
      // Arxa plan sənin istədiyin kimi qaldı
      className="
        sticky top-0 z-10 bg-(--bg-color) mb-4
        transition-all duration-300 ease-in-out
        animate-fade-in md:pt-0
      "
    >
      {/* Header Top Row */}
      <div className="flex items-center justify-between gap-4 sm:gap-3">
        {/* Left: Back Button + Title */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <Button
            type="button"
            aria-label={t("common.back")}
            onClick={onClickBack}
            icon={<ArrowLeft size={20} />}
            className="
              w-[42px] h-[42px] rounded-[10px] border-none shrink-0
              flex items-center justify-center
              bg-(--disabled-bg) text-(--text-primary)
              transition-colors duration-200 ease-in-out
              hover:bg-(--active-bg-2) hover:text-(--primary-color)
              max-[480px]:w-10 max-[480px]:h-10
            "
          />

          <h1
            className="
              text-[24px] md:text-[28px] font-extrabold text-(--text-primary)
              m-0 whitespace-nowrap overflow-hidden text-ellipsis
              tracking-tight
            "
          >
            {headerTitle}
          </h1>
        </div>

        {/* Right: Save Button */}
        {showHeaderButton && (
          <Button
            type="button"
            aria-label={t("common.save_changes")}
            title={t("common.save_changes")}
            disabled={isHeaderButtonDisabled}
            onClick={onHeaderButtonClick}
            isLoading={isLoading}
            icon={<Save size={18} />}
            className={`
              flex items-center gap-2 px-5 shrink-0 h-[42px]
              rounded-[10px] text-white text-[15px] font-semibold border-none
              transition-all duration-300 ease-in-out
              max-[640px]:w-[42px] max-[640px]:p-0 max-[640px]:justify-center
              max-[480px]:w-10 max-[480px]:h-10
              [&>span]:inline-block [&>span]:whitespace-nowrap
              max-[640px]:[&>span]:hidden
              ${
                isHeaderButtonDisabled
                  ? "bg-(--disabled-bg) text-(--disabled-text) shadow-none cursor-not-allowed"
                  : "bg-linear-to-br from-(--third-color) to-(--hover-bg) shadow-(--active-shadow) hover:shadow-lg"
              }
            `}
          />
        )}
      </div>

      {/* Subtitle */}
      <p className="text-[14px] font-medium text-(--muted-color) m-0 mt-2">
        {headerSubtitle}
      </p>
    </div>
  );
};

export default UniqueHeader;
