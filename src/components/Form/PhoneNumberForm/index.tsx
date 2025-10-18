import { Fragment, useMemo, useState } from "react";
import "./index.style.css";
import { COUNTRIES } from "@/pages/auth/constants/constant";
import { useTranslation } from "react-i18next";
import Input from "@/components/Input/Input";
import { Tooltip } from "@mui/material";
import useBoolean from "@/hooks/useBoolean";
import CountryCodeModal from "@/components/Modal/CountryCodeModal";

const PhoneNumberForm = () => {
  const { t } = useTranslation();

  const [countryKey, setCountryKey] = useState<string>(COUNTRIES[0].key);

  const country = useMemo(
    () => COUNTRIES.find((c) => c.key === countryKey) || COUNTRIES[0],
    [countryKey]
  );

  const countryModal = useBoolean();

  return (
    <Fragment>
      <div className="phone-number-form">
        <Tooltip placement="top" title={t("common.select_country")}>
          <div className="country-code" onClick={countryModal.onOpen}>
            <span className={country.flag}></span>
            <span>{country.code}</span>
          </div>
        </Tooltip>
        <div className="phone-number">
          <Input inputSize="medium" label={t("common.phoneNumber")} isNumber type="number" />
        </div>
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
