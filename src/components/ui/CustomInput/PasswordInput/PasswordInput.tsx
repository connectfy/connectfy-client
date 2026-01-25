import "./passwordInput.css";
import Input, {
  CustomInputProps,
} from "@/components/ui/CustomInput/Input/Input.tsx";
import React, { FC, useState } from "react";
import KeyIcon from "@/assets/icons/KeyIcon.tsx";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { IconButton } from "@mui/material";
import EyeIcon from "@/assets/icons/EyeIcon.tsx";
import EyeCloseIcon from "@/assets/icons/EyeCloseIcon.tsx";
import { snack } from "@/common/utils/snackManager.ts";
import LockIcon from "@/assets/icons/LockIcon.tsx";

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
        icon={<LockIcon />}
      />

      <div className="password-input-icons">
        {showGenerateButton && (
          <Tooltip placement={"top"} title={t("common.generate_password")}>
            <IconButton size="small" onClick={handleGenerate}>
              <KeyIcon />
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
            {visible ? <EyeIcon /> : <EyeCloseIcon />}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default PasswordInput;
