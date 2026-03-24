import { type FC, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/CustomInput/Input/Input.tsx";
import { useTranslation } from "react-i18next";
import { ICountry } from "@/common/interfaces/interfaces";
import { COUNTRIES } from "@/common/constants/constants";
import Button from "@/components/ui/CustomButton/Button/Button";
import Modal from "..";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect?: (country: ICountry) => void;
  initialSelectedKey?: string;
}

export const CountryCodeModal: FC<Props> = ({
  open,
  onClose,
  onSelect,
  initialSelectedKey,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.key.toLowerCase().includes(q),
    );
  }, [query]);

  const handleSelect = (country: ICountry) => {
    onSelect?.(country);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[520px] max-w-[96%] max-h-[84vh] overflow-hidden rounded-xl bg-(--bg-color) shadow-(--card-shadow) flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="country-code-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
              <h3
                id="country-code-modal"
                className="m-0 text-base font-semibold text-(--text-color)"
              >
                {t("common.select_country")}
              </h3>
              <Button
                onClick={onClose}
                aria-label="close"
                className="p-1.5 rounded-lg text-(--muted-color) hover:bg-(--active-bg-2) hover:text-(--text-color) transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 pt-0 flex flex-col overflow-hidden">
              <div className="py-4">
                <Input
                  title={t("common.search_country")}
                  value={query}
                  inputSize="medium"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {/* Country List */}
              <div
                className="overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-[var(--muted-color)]"
                style={{ maxHeight: "calc(84vh - 160px)" }}
                role="list"
              >
                {filtered.map((c) => {
                  const isSelected = initialSelectedKey === c.key;
                  return (
                    <Button
                      key={c.key}
                      type="button"
                      onClick={() => handleSelect(c)}
                      className={`group w-full flex items-center gap-3 p-2.5 rounded-lg border-none bg-transparent cursor-pointer text-left transition-all duration-300 hover:translate-y-px
                        ${
                          isSelected
                            ? "bg-(--active-bg) shadow-(--active-shadow)"
                            : "hover:bg-(--active-bg-2)"
                        }`}
                      aria-label={`${c.name} ${c.code}`}
                    >
                      <span
                        className={`w-9 h-6 shrink-0 rounded-[4px] bg-cover bg-center sm:w-7 sm:h-[18px] ${c.flag}`}
                        aria-hidden="true"
                      />
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[0.95rem] font-semibold text-(--text-color)">
                          {t(`countries.${c.name}`)}
                        </span>
                        <div className="w-[30%] min-w-[52px] min-h-[48px] flex items-center justify-center bg-(--input-bg) border border-(--input-border) rounded-lg text-(--muted-color) font-bold transition-all group-hover:border-(--primary-color)">
                          {c.code}
                        </div>
                      </div>
                    </Button>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="py-8 text-center text-(--muted-color) text-sm font-black">
                    {t("common.no_results_found") || "No countries found."}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default CountryCodeModal;
