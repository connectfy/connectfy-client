import "./passwordInput.style.css";
import Input, {
  CustomInputProps,
} from "@/components/ui/CustomInput/Input/Input.tsx";
import React, { FC, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { IconButton } from "@mui/material";
import { snack } from "@/common/utils/snackManager.ts";

interface Props extends CustomInputProps {
  showGenerateButton?: boolean;
  onGenerate?: (value: string) => void;
}

const PasswordInput: FC<Props> = ({
  showGenerateButton,
  onGenerate,
  ...props
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  async function generatePassword(len = 15) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
    let res = "";
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    await navigator.clipboard.writeText(res);
    return res;
  }

  async function handleGenerate() {
    const generated = await generatePassword();
    if (onGenerate) {
      onGenerate(generated);
      snack.info(t("user_messages.password_generated_message"), {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        autoHideDuration: 15000,
      });
      return;
    }
    props.onChange?.({
      target: { value: generated },
    } as React.ChangeEvent<HTMLInputElement>);
    snack.info(t("user_messages.password_generated_message"), {
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
      autoHideDuration: 15000,
    });
  }

  return (
    <div className="password-input-wrapper">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className="password-input"
        icon={<span className="material-symbols-outlined">lock</span>}
      />

      <div className="password-input-icons">
        {showGenerateButton && (
          <Tooltip placement={"top"} title={t("common.generate_password")}>
            <IconButton size="small" onClick={handleGenerate}>
              <span className="material-symbols-outlined text-(--text-(--primary-color))">
                key
              </span>
            </IconButton>
          </Tooltip>
        )}

        <Tooltip
          placement={"top"}
          title={
            visible ? t("common.hide_password") : t("common.show_password")
          }
        >
          <IconButton size="small" onClick={() => setVisible((v) => !v)}>
            {visible ? (
              <span className="material-symbols-outlined text-(--text-color)">
                visibility_off
              </span>
            ) : (
              <span className="material-symbols-outlined text-(--text-color)">
                visibility
              </span>
            )}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default PasswordInput;
