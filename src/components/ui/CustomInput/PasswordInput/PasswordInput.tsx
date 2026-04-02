import "./passwordInput.style.css";
import Input, {
  CustomInputProps,
} from "@/components/ui/CustomInput/Input/Input.tsx";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { snack } from "@/common/utils/snackManager.ts";
import { Eye, EyeClosed, KeyRound, LockKeyhole } from "lucide-react";
import Button from "../../CustomButton/Button/Button";
import TextTooltip from "@/components/Tooltip/TextTooltip";

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

  async function handleGenerate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const generated = await generatePassword();
    if (onGenerate) {
      onGenerate(generated);
      snack.info(t("user_messages.password_generated_message"), {
        duration: 15000,
      });
      return;
    }
    props.onChange?.({
      target: { value: generated },
    } as React.ChangeEvent<HTMLInputElement>);
    snack.info(t("user_messages.password_generated_message"), {
      duration: 15000,
    });
  }

  return (
    <div className="password-input-wrapper">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className="password-input"
        icon={<LockKeyhole size={18} />}
      />

      <div className="password-input-icons">
        {showGenerateButton && (
          <TextTooltip position={"top"} text={t("common.generate_password")}>
            <Button type="button" onClick={handleGenerate}>
              <KeyRound size={20} className="text-(--text-primary)" />
            </Button>
          </TextTooltip>
        )}

        <TextTooltip
          position={"top"}
          text={visible ? t("common.hide_password") : t("common.show_password")}
        >
          <Button type="button" onClick={() => setVisible((v) => !v)}>
            {visible ? (
              <EyeClosed size={20} className="text-(--text-primary)" />
            ) : (
              <Eye size={20} className="text-(--text-primary)" />
            )}
          </Button>
        </TextTooltip>
      </div>
    </div>
  );
};

export default PasswordInput;
