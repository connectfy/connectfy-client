import { FC, Fragment, useEffect, useMemo, useState } from "react";
import "./index.style.css";
import { COUNTRIES } from "@/common/constants/constants";
import { useTranslation } from "react-i18next";
import Input from "@/components/Input/Input";
import { Tooltip } from "@mui/material";
import useBoolean from "@/hooks/useBoolean";
import CountryCodeModal from "@/components/Modal/CountryCodeModal";
import { IPhoneNumber } from "@/modules/auth/types/types";

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
    [countryKey]
  );

  const countryModal = useBoolean();

  const [fieldValue, setFieldValue] = useState<string | null>(null);

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
  }, [fieldValue]);

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
      <div id="phone-number-form">
        <div className="phone-number-form">
          <Tooltip placement="top" title={t("common.select_country")}>
            <div className="country-code" onClick={countryModal.onOpen}>
              <span className={country.flag}></span>
              <span>{country.code}</span>
            </div>
          </Tooltip>
          <div className="phone-number">
            <Input
              inputSize="medium"
              label={t("common.phoneNumber")}
              name={name}
              value={fieldValue || ""}
              onChange={(e) => {
                const value = e.target.value;
                const numericValue = value.replace(/\D/g, "");
                setFieldValue(numericValue || null);
              }}
              onBlur={onBlur}
              inputMode="numeric"
              onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : undefined)}
              hasError={hasLengthError && blur}
            />
          </div>
        </div>
        {hasLengthError && blur && (
          <h6>{t("error_messages.invalid_phone_number_length")}</h6>
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
