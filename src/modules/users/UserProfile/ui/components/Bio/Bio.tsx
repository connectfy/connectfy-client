import { FC, Fragment } from "react";
import { UserPen, MinusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { IFindOneProfile } from "../../../types/types";

interface IProps {
  profile: IFindOneProfile;
}

const Bio: FC<IProps> = ({ profile }) => {
  const { t } = useTranslation();

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
    </Fragment>
  );
};

export default Bio;
