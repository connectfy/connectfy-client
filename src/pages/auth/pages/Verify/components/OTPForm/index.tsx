import React from "react";
import { Box } from "@mui/material";
import "./index.style.css";

type OTPProps = {
  length?: number;
  onComplete?: (code: string) => void;
};

export default function OTPForm({ length = 5, onComplete }: OTPProps) {
  const [values, setValues] = React.useState(() => Array(length).fill(""));
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    const first = inputsRef.current.findIndex((i) => !i || i.value === "");
    const idx = first === -1 ? 0 : first;
    inputsRef.current[idx]?.focus();
  }, [length]);

  const focus = (i: number) => inputsRef.current[i]?.focus();
  const select = (i: number) => inputsRef.current[i]?.select();

  const updateAt = (index: number, ch: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[index] = ch;
      return next;
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    const key = e.key;
    if (key === "ArrowLeft") {
      e.preventDefault();
      if (idx > 0) focus(idx - 1);
    } else if (key === "ArrowRight") {
      e.preventDefault();
      if (idx < length - 1) focus(idx + 1);
    } else if (key === "Backspace") {
      e.preventDefault();
      updateAt(idx, "");
      if (idx > 0) {
        focus(idx - 1);
        select(idx - 1);
      }
    } else if (key === "Delete") {
      e.preventDefault();
      updateAt(idx, "");
    } else if (key === "Enter") {
      e.preventDefault();
      const code = values.join("").trim();
      code.length === length && onComplete?.(code);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const raw = e.target.value;
    if (!Number(raw) && Number(raw) !== 0) return;
    const char = raw.replace(/\\s+/g, "").slice(-1);
    updateAt(idx, char);
    if (char !== "" && idx < length - 1) focus(idx + 1);

    const next = [...values];
    next[idx] = char;
    const code = next.join("").trim();
    if (code.length === length) onComplete?.(code);
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\\D/g, "");
    if (!text) return;
    const chars = text.split("").slice(0, length - idx);
    setValues((prev) => {
      const next = [...prev];
      for (let i = 0; i < chars.length; i++) next[idx + i] = chars[i];
      return next;
    });
    const lastIndex = Math.min(length - 1, idx + chars.length - 1);
    focus(lastIndex);
    const code = values
      .map((v, i) =>
        i >= idx && void v ? (chars[i - idx] ?? values[i]) : values[i]
      )
      .join("")
      .trim();
    if (code.length >= length) {
      const full = values.slice(0, idx).concat(chars).slice(0, length).join("");
      onComplete?.(full);
    }
  };

  return (
    <Box className="otp-wrap">
      <Box className="otp-row" role="group" aria-label="OTP code">
        {Array.from({ length }).map((_, i) => (
          <React.Fragment key={i}>
            <input
              aria-label={`digit-${i + 1}`}
              className="otp-input"
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              value={values[i] ?? ""}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              inputMode="numeric"
              maxLength={1}
            />
            {i !== length - 1 && <div className="otp-sep">-</div>}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
