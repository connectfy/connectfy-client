import {
  Cake,
  Phone,
  Mail,
  MapPin,
  MapMinusIcon,
  Contact,
  Users,
  UserPen,
} from "lucide-react";
import { FC, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { DDMMMMYYY, formatPhoneNumber } from "@/common/utils/formatValues";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import { PrivacyIcon } from "../PrivacyIcon/PrivacyIcon";
import Button from "@/components/ui/CustomButton/Button/Button";
import {
  IEditPrivacySettings,
  IPrivacySettings,
} from "@/modules/settings/PrivacySettings/types/types";
import { COUNTRIES } from "@/common/constants/constants";
import useBoolean from "@/hooks/useBoolean";
import PersonalInfoModal from "../Modal/PersonalInfoModal/PersonalInfoModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import PersonalInformationSkeleton from "@/components/Skeleton/profile/PersonalInformationSkeleton";
import { IAccount, IMe } from "@/modules/profile/types/types";

export interface IInfoItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  colorClass: string;
  privacyField: keyof IEditPrivacySettings;
}

interface IProps {
  user: IMe | undefined;
  profile: IAccount | undefined;
  privacySettings: IPrivacySettings | undefined;
  isLoading: boolean;
  hasPhoneNumber: boolean;
}

const PersonalInformation: FC<IProps> = ({
  user,
  profile,
  privacySettings,
  isLoading,
  hasPhoneNumber,
}) => {
  const { t } = useTranslation();
  const { open, onOpen, onClose } = useBoolean();
  const isMobile = useIsMobile();

  const phoneNumberMask = COUNTRIES.find(
    (country) => country.code === user?.phoneNumber?.countryCode,
  )?.format;

  // Məlumat kartlarını dinamik render etmək üçün obyektlər massivi
  const infoItems: IInfoItem[] = [
    {
      id: "email",
      icon: <Mail size={isMobile ? 15 : 20} />,
      label: t("common.email"),
      value: user?.email || "Məlumat yoxdur",
      colorClass:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
      privacyField: "email",
    },
    {
      id: "gender",
      icon: <Users size={isMobile ? 15 : 20} />,
      label: t("common.gender"),
      value: profile?.gender || "Məlumat yoxdur",
      colorClass:
        "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
      privacyField: "gender",
    },
    {
      id: "phone",
      icon: <Phone size={isMobile ? 15 : 20} />,
      label: t("common.phone"),
      value: hasPhoneNumber
        ? formatPhoneNumber(
            user?.phoneNumber?.number as string,
            phoneNumberMask as string,
            user?.phoneNumber?.countryCode as string,
          )
        : t("common.no_phone_data"),
      colorClass:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
      privacyField: "phoneNumber",
    },
    {
      id: "birthday",
      icon: <Cake size={isMobile ? 15 : 20} />,
      label: t("common.birthday"),
      value: profile?.birthdayDate
        ? DDMMMMYYY(profile?.birthdayDate)
        : "Məlumat yoxdur",
      colorClass:
        "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
      privacyField: "birthdayDate",
    },
    {
      id: "location",
      icon: <MapPin size={isMobile ? 15 : 20} />,
      label: t("common.location"),
      value: profile?.location || (
        <span className="flex items-center gap-1 italic font-medium text-slate-400">
          <MapMinusIcon size={16} /> {t("common.no_location_info")}
        </span>
      ),
      colorClass:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
      privacyField: "location",
    },
  ];

  return (
    <Fragment>
      <section
        className="p-8 mb-8 px-4 md:px-8 transition-all duration-300 bg-(--auth-main-bg) rounded-[20px] border border-(--auth-glass-border) shadow-(--card-shadow)"
        aria-labelledby="personal-info-heading"
      >
        {/* Header */}
        <div className="flex flex-row items-center justify-between gap-3 mb-6 md:mb-8">
          {/* Sol tərəf: İkon və Başlıq */}
          <div className="flex items-center gap-2 md:gap-3">
            <Contact className="w-6 h-6 md:w-7 md:h-7 text-(--primary-color)" />
            <h2
              id="personal-info-heading"
              className="m-0 text-lg font-bold md:text-2xl text-(--text-color)"
            >
              {t("common.personal_information")}
            </h2>
          </div>

          {/* Sağ tərəf: Düymə */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Böyük ekranlar üçün düymə (1024px-dən yuxarı görünür) */}
            <Button
              className="hidden lg:flex bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold px-4 py-2 rounded-lg items-center gap-2 transition-all hover:opacity-80 border-none text-sm whitespace-nowrap"
              title={t("common.edit")}
              onClick={onOpen}
            />

            {/* Mobil ekranlar üçün ikonlu düymə (1024px-dən aşağı görünür) */}
            <Button
              className="flex lg:hidden bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold p-3 rounded-lg items-center justify-center transition-all hover:opacity-80 border-none"
              icon={<UserPen size={16} />}
              onClick={onOpen}
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <PersonalInformationSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {infoItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 lg:px-5 bg-(--info-card-bg) border border-(--info-card-border) rounded-xl transition-all duration-200 hover:bg-(--active-bg-2) group"
              >
                {/* Icon Box */}
                <div
                  className={`flex items-center justify-center rounded-xl shrink-0 transition-transform w-10 h-10 md:w-12 md:h-12 ${isMobile ? "" : "group-hover:scale-110"} ${item.colorClass}`}
                >
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 gap-1 overflow-hidden">
                  <span className="text-[11px] font-bold tracking-widest text-(--muted-color) uppercase">
                    {item.label}
                  </span>
                  <div className="text-[15px] font-semibold text-(--text-color) truncate flex items-center gap-1.5">
                    {item.value}
                  </div>
                </div>

                {/* Privacy Icon */}
                <div className="flex items-center justify-center text-(--text-disabled) opacity-60">
                  <PrivacyIcon
                    privacy={
                      (privacySettings?.[
                        item.privacyField
                      ] as PRIVACY_SETTINGS_CHOICE) ||
                      PRIVACY_SETTINGS_CHOICE.EVERYONE
                    }
                    fieldName={item.privacyField as keyof IEditPrivacySettings}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {open && (
        <PersonalInfoModal open={open} onClose={onClose} profile={profile} />
      )}
    </Fragment>
  );
};

export default PersonalInformation;
