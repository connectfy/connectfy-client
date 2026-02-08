import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { COUNTRIES } from "@/common/constants/constants";
import { useTranslation } from "react-i18next";
import Input from "@/components/ui/CustomInput/Input/Input.tsx";
import useBoolean from "@/hooks/useBoolean";
import CountryCodeModal from "@/components/Modal/CountryCodeModal/CountryCodeModal";
import { IPhoneNumber } from "@/modules/auth/types/types";
import Button from "@/components/ui/CustomButton/Button/Button";

interface Props {
  name: string;
  value?: IPhoneNumber | null;
  blur?: boolean;
  onBlur?: () => void;
  onChange: (value: IPhoneNumber | null) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
}

const PhoneNumberForm: FC<Props> = ({
  name,
  value,
  onBlur,
  blur,
  onChange,
  onKeyDown,
}) => {
  const { t } = useTranslation();

  const [countryKey, setCountryKey] = useState<string>(COUNTRIES[0].key);
  const [hasLengthError, setHasLengthError] = useState<boolean>(false);

  const country = useMemo(
    () => COUNTRIES.find((c) => c.key === countryKey) || COUNTRIES[0],
    [countryKey],
  );

  const countryModal = useBoolean();

  const [fieldValue, setFieldValue] = useState<string | null>(null);

  const formatPhoneNumber = (value: string, mask: string) => {
    if (!value) return "";

    let formatted = "";
    let valueIndex = 0;

    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      if (mask[i] === "0") {
        formatted += value[valueIndex];
        valueIndex++;
      } else {
        formatted += mask[i];
      }
    }
    return formatted;
  };

  const displayValue = useMemo(() => {
    return formatPhoneNumber(fieldValue || "", country.format || "");
  }, [fieldValue, country]);

  useEffect(() => {
    if (fieldValue)
      onChange({
        countryCode: country.code,
        number: fieldValue,
        fullPhoneNumber: country.code + fieldValue,
      });
    else onChange(null);
  }, [fieldValue, country.code]);

  useEffect(() => {
    if (fieldValue?.length !== country.numberLength) setHasLengthError(true);
    else setHasLengthError(false);
  }, [fieldValue, country.numberLength]);

  useEffect(() => {
    if (value) {
      const { countryCode, number } = value;

      const country = COUNTRIES.find((c) => c.code === countryCode);

      if (country) {
        setCountryKey(country.key);
        setFieldValue(number);
      }
    }
  }, [value]);

  return (
    <Fragment>
      <div id="phone-number-form" className="flex flex-col w-full">
        {/* Ana konteyner: CSS-dəki .phone-number-form */}
        <div className="flex w-full gap-3 items-start">
          {/* Ölkə kodu hissəsi: CSS-dəki .country-code (30%) */}

          <Button
            type="button"
            tooltip={t("common.select_country")}
            onClick={countryModal.onOpen}
            // Tailwind ilə bütün stillər bura keçirildi
            className={`
                  flex items-center justify-center gap-2
                  md:w-[130px] w-[105px] h-[58px] rounded-lg border transition-all duration-300
                  bg-(--input-bg) border-(--input-border)
                  hover:border-(--primary-color)
                `}
          >
            <span className={`${country.flag} scale-125`}></span>
            <span className="text-(--text-primary) font-medium">
              {country.code}
            </span>
          </Button>

          {/* Telefon nömrəsi hissəsi: CSS-dəki .phone-number (70%) */}
          <div className="w-full">
            <Input
              className="w-full px-5 py-4 h-[58px] rounded-xl text-(--text-primary) outline-none transition-all duration-200 placeholder:text-(--text-secondary)/50 focus:ring-2 focus:ring-[#34d399]/50"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--input-border)",
              }}
              title={t("common.phoneNumber")}
              name={name}
              value={displayValue}
              onChange={(e) => {
                const val = e.target.value;
                const numericValue = val.replace(/\D/g, "");

                if (!country || numericValue.length > country.numberLength)
                  return;

                setFieldValue(numericValue || null);
              }}
              onBlur={onBlur}
              inputMode="numeric"
              onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : undefined)}
              isError={hasLengthError && blur}
              maxLength={country.totalLength}
            />
          </div>
        </div>

        {/* Xəta mesajı */}
        {hasLengthError && blur && (
          <h6 className="mt-2 text-red-500 text-sm font-medium">
            {t("error_messages.invalid_phone_number_length")}
          </h6>
        )}
      </div>

      <CountryCodeModal
        open={countryModal.open}
        onClose={countryModal.onClose}
        onSelect={(countryKey) => setCountryKey(countryKey.key)}
      />
    </Fragment>
  );
};

export default PhoneNumberForm;
