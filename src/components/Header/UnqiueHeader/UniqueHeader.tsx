import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/CustomButton/Button/Button";

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
      className="
        sticky top-0 z-10 bg-(--bg-color) mb-3 pb-4
        transition-shadow duration-300 ease-in-out
        animate-fade-in pt-2 md:pt-0
      "
    >
      {/* Header Top Row */}
      <div className="flex items-center justify-between mb-2 gap-4 sm:gap-3">
        {/* Left: Back Button + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            type="button"
            aria-label={t("common.back")}
            onClick={onClickBack}
            icon={<span className="material-symbols-outlined">arrow_back</span>}
            className="
              w-10 h-10 rounded-[10px] border-none shrink-0
              flex items-center justify-center
              bg-(--auth-glass-bg) text-(--text-primary)
              transition-all duration-200 ease-in-out
              max-[480px]:w-9 max-[480px]:h-9
            "
          />

          <h1
            className="
              text-[28px] font-extrabold text-(--text-primary)
              m-0 whitespace-nowrap overflow-hidden text-ellipsis
              max-[1024px]:text-2xl max-[480px]:text-[22px]
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
            icon={<span className="material-symbols-outlined">save</span>}
            className="
              flex items-center gap-2 px-5 py-[5px] shrink-0
              bg-linear-to-br from-(--third-color) to-(--hover-bg)
              border-none rounded-[10px] text-white text-sm font-bold
              shadow-[0_4px_12px_rgba(46,204,113,0.25)]
              transition-all duration-2000 ease-in-out
              hover:from-(--hover-bg) hover:to-[#229954]
              hover:shadow-[0_6px_20px_rgba(46,204,113,0.35)]
              active:translate-y-0 active:shadow-[0_2px_8px_rgba(46,204,113,0.25)]
              disabled:opacity-55 disabled:shadow-none disabled:transform-none
              max-[640px]:w-10 max-[640px]:h-10 max-[640px]:p-0 max-[640px]:justify-center
              max-[480px]:w-9 max-[480px]:h-9
              [&>span]:inline-block [&>span]:whitespace-nowrap
              max-[640px]:[&>span]:hidden h-[40px]
            "
            showTitleInMobile={false}
          />
        )}
      </div>

      {/* Subtitle */}
      <p className="text-sm text-slate-500 dark:text-slate-400 m-0 mt-3">
        {headerSubtitle}
      </p>
    </div>
  );
};

export default UniqueHeader;
