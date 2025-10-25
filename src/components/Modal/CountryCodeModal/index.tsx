import { type FC, useMemo, useState } from "react";
import { Modal, Box, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./index.style.css";
import { COUNTRIES } from "@/pages/auth/constants/constant";
import { Country } from "@/types/auth/auth.type";
import Input from "@/components/Input/Input";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect?: (country: Country) => void;
  initialSelectedKey?: string;
}

export const CountryCodeModal: FC<Props> = ({
  open,
  onClose,
  onSelect,
  initialSelectedKey,
}) => {
  const { t } = useTranslation();

  const [query, setQuery] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const q = query?.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.key.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (country: Country) => {
    if (onSelect) onSelect(country);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="country-code-modal"
      closeAfterTransition
    >
      <Slide direction="up" in={open}>
        <Box
          className="country-modal-backdrop"
          onClick={onClose}
        >
          <Box
            className="country-modal-paper"
            role="dialog"
            aria-modal="true"
            aria-labelledby="country-code-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="country-modal-header">
              <h3 id="country-code-modal">{t("common.select_country")}</h3>
              <IconButton size="small" onClick={onClose} aria-label="close">
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>

            <div style={{ padding: "0 1rem 1rem 1rem" }}>
              <Input
                label={t("common.search_country")}
                value={query ?? ""}
                inputSize="medium"
                onChange={(e) => setQuery(e.target.value)}
                fullWidth
              />

              <div className="country-list" role="list">
                {filtered.map((c) => {
                  const isSelected = initialSelectedKey === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      className={`country-item ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelect(c)}
                      aria-label={`${c.name} ${c.code}`}
                    >
                      <span
                        className={`country-flag ${c.flag}`}
                        aria-hidden="true"
                      />
                      <div className="country-meta">
                        <div className="country-name">{t(`countries.${c.name}`)}</div>
                        <div className="country-code">{c.code}</div>
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="no-results">No countries found.</div>
                )}
              </div>
            </div>
          </Box>
        </Box>
      </Slide>
    </Modal>
  );
};

export default CountryCodeModal;
