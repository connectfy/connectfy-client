import {
  type SxProps,
  type Theme,
  type TextFieldProps,
  TextField,
} from "@mui/material";
import { PropsWithChildren } from "react";
import "./input.sytle.css";

type Props = TextFieldProps & {
  isNumber?: boolean;
  title?: string;
  inputSize?: "small" | "medium" | "large" | "xlarge";
  forceFloating?: boolean;
  hasError?: boolean;
};

export default function Input({
  inputSize = "medium",
  hasError = false,
  value,
  className,
  style,
  fullWidth,
  InputProps,
  InputLabelProps,
  sx,
  ...props
}: PropsWithChildren<Props>) {
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
      color: "var(--text-color)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--border-color)",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: hasError ? "var(--error-color)" : "var(--primary-color)",
        boxShadow: hasError
          ? "0 0 0 4px rgba(211,47,47,0.08)"
          : "0 0 0 4px rgba(72,187,120,0.08)",
        transition: "all .3s ease-in-out"
      },
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--error-color)",
      },
    },
    "& .MuiFormHelperText-root": {
      color: hasError ? "var(--error-color)" : undefined,
    },
  };

  const mergedSx = Array.isArray(sx) ? [...sx, customSx] : [sx ?? {}, customSx];

  return (
    <div
      className="input_box"
      style={hasInlineWidth ? undefined : { width: "100%" }}
    >
      <TextField
        {...props}
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
