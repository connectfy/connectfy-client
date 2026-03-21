import { FC, Fragment } from "react";
import { UserPen, MinusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import Button from "@/components/ui/CustomButton/Button/Button";
import { PrivacyIcon } from "../PrivacyIcon/PrivacyIcon";
import useBoolean from "@/hooks/useBoolean";
import BioModal from "../Modal/BioModal/BioModal";
import { IAccount } from "@/modules/profile/types/types";
import { IPrivacySettings } from "@/modules/settings/PrivacySettings/types/types";

interface IProps {
  profile: IAccount | undefined;
  privacySettings: IPrivacySettings | undefined;
}

const Bio: FC<IProps> = ({ profile, privacySettings }) => {
  const { t } = useTranslation();
  const { open, onOpen, onClose } = useBoolean();

  return (
    <Fragment>
      <section
        className="p-8 mb-8 transition-all duration-300 bg-(--auth-main-bg) rounded-[20px] border border-(--auth-glass-border) shadow-(--card-shadow)"
        aria-labelledby="bio-heading"
      >
        {/* Header Hissəsi */}
        <div className="flex flex-row items-center justify-between gap-3 mb-6 md:mb-8">
          {/* Sol tərəf: İkon və Başlıq */}
          <div className="flex items-center gap-2 md:gap-3">
            <UserPen className="w-6 h-6 md:w-7 md:h-7 text-(--primary-color)" />
            <h2
              id="bio-heading"
              className="m-0 text-lg font-bold md:text-2xl text-(--text-color)"
            >
              {t("common.bio")}
            </h2>
          </div>

          {/* Sağ tərəf: Məxfilik və Redaktə Düyməsi */}
          <div className="flex items-center gap-2 md:gap-3">
            <PrivacyIcon
              privacy={privacySettings?.bio || PRIVACY_SETTINGS_CHOICE.EVERYONE}
              fieldName="bio"
            />

            {/* Böyük ekranlar üçün (Text ilə) */}
            <Button
              className="hidden lg:flex bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold px-4 py-2 rounded-lg items-center gap-2 transition-all hover:opacity-80 border-none text-sm whitespace-nowrap"
              title={t("common.edit")}
              onClick={onOpen}
            />

            {/* Mobil ekranlar üçün (İkon ilə) */}
            <Button
              className="flex lg:hidden bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold p-3 rounded-lg items-center justify-center transition-all hover:opacity-80 border-none"
              icon={<UserPen size={16} />}
              onClick={onOpen}
            />
          </div>
        </div>

        {/* Bio Mətni */}

        <div className="p-6 rounded-xl bg-(--info-card-bg) border border-(--info-card-border) transition-all duration-200 hover:bg-(--active-bg-2)">
          {profile?.bio ? (
            <div
              className="text-[15px] leading-[1.7] text-(--text-color) prose prose-sm max-w-none [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_s]:line-through"
              dangerouslySetInnerHTML={{ __html: profile.bio }}
            />
          ) : (
            <div className="flex items-center gap-2 text-(--muted-color) italic py-2">
              <MinusIcon size={18} />
              <span>{t("common.no_bio_info")}</span>
            </div>
          )}
        </div>
      </section>

      {open && <BioModal open={open} onClose={onClose} />}
    </Fragment>
  );
};

export default Bio;
