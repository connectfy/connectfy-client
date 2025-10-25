import { useState } from "react";
import {
  type SxProps,
  type Theme,
  type TextFieldProps,
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff, Key } from "@mui/icons-material";
import { type PropsWithChildren } from "react";
import "./passwordInput.style.css";
import { useTranslation } from "react-i18next";

type Props = TextFieldProps & {
  inputSize?: "small" | "medium" | "large" | "xlarge";
  hasError?: boolean;
  showGenerateIcon?: boolean;
  onGenerate?: (value?: string) => void;
};

export default function PasswordInput({
  inputSize = "medium",
  hasError = false,
  value,
  className,
  style,
  fullWidth,
  InputProps,
  InputLabelProps,
  sx,
  showGenerateIcon = false,
  onGenerate,
  ...props
}: PropsWithChildren<Props>) {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const hasInlineWidth = style && (style as any).width;
  const effectiveFullWidth = fullWidth ?? !hasInlineWidth;

  const nativeInputClass =
    `${(InputProps as any)?.inputProps?.className ?? ""} ${inputSize}`.trim();

  const mergedInputProps = {
    ...(InputProps ?? {}),
    inputProps: {
      ...((InputProps as any)?.inputProps ?? {}),
      className: nativeInputClass,
    },
  };

  const labelSx: SxProps<Theme> = [
    (InputLabelProps as any)?.sx ?? {},
    {
      color: hasError ? "var(--error-color)" : "var(--border-color)",
      "&.Mui-focused": {
        color: hasError ? "var(--error-color)" : "var(--primary-color)",
      },
      "&.Mui-error": {
        color: "var(--error-color)",
      },
    },
  ];

  const mergedLabelProps = {
    ...(InputLabelProps ?? {}),
    className:
      `${(InputLabelProps as any)?.className ?? ""} ${inputSize}`.trim(),
    sx: labelSx,
  };

  const rootClass = `input_root ${inputSize} ${className ?? ""}`.trim();

  const customSx: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
      color: "var(--border-color)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: hasError ? "var(--error-color)" : "var(--border-color)",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: hasError ? "var(--error-color)" : "var(--border-color)",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: hasError ? "var(--error-color)" : "var(--primary-color)",
        boxShadow: hasError
          ? "0 0 0 4px rgba(211,47,47,0.08)"
          : "0 0 0 4px rgba(72,187,120,0.08)",
        transition: "all .3s ease-in-out",
      },
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--error-color)",
      },
    },
    "& .MuiFormHelperText-root": {
      color: hasError ? "var(--error-color)" : undefined,
    },
    "& .MuiInputBase-input": {
      color: "var(--border-color)",
    },
  };

  const mergedSx = Array.isArray(sx) ? [...sx, customSx] : [sx ?? {}, customSx];

  function generatePassword(len = 12) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
    let res = "";
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  }

  function handleGenerate() {
    const generated = generatePassword();
    if (onGenerate) {
      onGenerate(generated);
      return;
    }
    const synthetic = {
      target: { value: generated },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    if (props.onChange) props.onChange(synthetic);
  }

  const endAdornment = (
    <InputAdornment position="end">
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {showGenerateIcon && (
          <Tooltip placement="top" title={t("common.generate_password")}>
            <IconButton
              aria-label="generate password"
              size="small"
              onClick={handleGenerate}
              edge="end"
            >
              <Key fontSize="small" sx={{ color: "var(--border-color)" }} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip
          placement="top"
          title={
            visible ? t("common.hide_password") : t("common.show_password")
          }
        >
          <IconButton
            aria-label={visible ? "hide password" : "show password"}
            onClick={() => setVisible((s) => !s)}
            edge="end"
            size="small"
          >
            {visible ? (
              <Visibility
                fontSize="small"
                sx={{ color: "var(--border-color)" }}
              />
            ) : (
              <VisibilityOff
                fontSize="small"
                sx={{ color: "var(--border-color)" }}
              />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </InputAdornment>
  );

  mergedInputProps.endAdornment = mergedInputProps.endAdornment ?? endAdornment;

  return (
    <div
      className="input_box"
      style={hasInlineWidth ? undefined : { width: "100%" }}
    >
      <TextField
        {...props}
        type={visible ? "text" : "password"}
        value={value}
        className={rootClass}
        fullWidth={effectiveFullWidth}
        style={style}
        InputProps={mergedInputProps}
        InputLabelProps={mergedLabelProps}
        variant="outlined"
        autoComplete="off"
        error={hasError}
        sx={mergedSx}
      />
    </div>
  );
}
