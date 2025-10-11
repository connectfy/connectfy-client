import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LANGUAGE } from "@/types/enum.types";

interface LanguageModalProps {
  open: boolean;
  onClose: () => void;
}

const languages: { code: LANGUAGE; label: string; icon: string }[] = [
  { code: LANGUAGE.EN, label: "English", icon: "fi fi-gb" },
  { code: LANGUAGE.AZ, label: "Azərbaycan", icon: "fi fi-az" },
  { code: LANGUAGE.TR, label: "Türkçe", icon: "fi fi-tr" },
  { code: LANGUAGE.RU, label: "Русский", icon: "fi fi-ru" },
];

const LanguageModal: React.FC<LanguageModalProps> = ({ open, onClose }) => {
  const { i18n, t } = useTranslation();
  const theme = useTheme();

  const lang = localStorage.getItem("lang")
    ? (localStorage.getItem("lang") as LANGUAGE)
    : LANGUAGE.EN;

  const handleLanguageChange = (code: LANGUAGE) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Slide direction="up" in={open}>
        <Box
          sx={{
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
            borderRadius: "12px",
            boxShadow: 24,
            width: "100%",
            maxWidth: "400px",
            overflow: "hidden",
            outline: "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {t("common.select_lang")}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: "var(--text-color)",
                "&:hover": { color: "var(--primary-color)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Language List */}
          <RadioGroup
            value={lang}
            onChange={(e) => handleLanguageChange(e.target.value as LANGUAGE)}
            sx={{ p: 0 }}
          >
            <List disablePadding>
              {languages.map(({ code, label, icon }) => (
                <ListItem
                  key={code}
                  disablePadding
                  sx={{
                    "&:hover": {
                      backgroundColor: "var(--hover-bg)",
                    },
                  }}
                >
                  <FormControlLabel
                    value={code}
                    control={
                      <Radio
                        sx={{
                          color: "var(--text-color)",
                          "&.Mui-checked": {
                            color: "var(--text-color)",
                          },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <ListItemIcon
                          sx={{ minWidth: "40px", color: "inherit" }}
                        >
                          <span className={icon} style={{ fontSize: "24px" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={label}
                          primaryTypographyProps={{
                            fontWeight: lang === code ? 600 : 400,
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      width: "100%",
                      m: 0,
                      px: 2,
                      py: 1.5,
                      backgroundColor:
                        lang === code ? "var(--primary-color)" : "transparent",
                      color: lang === code ? "#fff" : "var(--text-color)",
                      "&:hover": {
                        backgroundColor:
                          lang === code
                            ? "var(--primary-color)"
                            : "var(--hover-bg)",
                        color: lang === code ? "#fff" : "var(--text-color)",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </RadioGroup>
        </Box>
      </Slide>
    </Modal>
  );
};

export default LanguageModal;
