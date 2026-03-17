import { ChangeEvent, useEffect, useRef, useState } from "react";
import Input from "@/components/ui/CustomInput/Input/Input";
import { useAppNavigation } from "@/hooks/useAppNavigation";

type OTPProps = {
  length: number;
  name: string;
  onComplete?: (code: string) => void;
  onChange: (value: string | null) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
};

export default function OTPForm({
  length,
  name,
  onComplete,
  onChange,
  onKeyDown,
}: OTPProps) {
  const { navigate } = useAppNavigation();
  const [values, setValues] = useState<string[]>(() => Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const lastEmittedRef = useRef<string | null>(null);
  const lastCompleteRef = useRef<string | null>(null);

  const focus = (i: number) => inputsRef.current[i]?.focus();
  const select = (i: number) => inputsRef.current[i]?.select();

  useEffect(() => {
    const firstEmpty = inputsRef.current.findIndex((i) => !i || i.value === "");
    const idx = firstEmpty === -1 ? Math.max(0, length - 1) : firstEmpty;
    inputsRef.current[idx]?.focus();
  }, [length]);

  useEffect(() => {
    const code = values.join("");
    if (code === lastEmittedRef.current) return;
    lastEmittedRef.current = code;
    if (code === "") onChange(null);
    else onChange(code);
    if (code.length === length && lastCompleteRef.current !== code) {
      lastCompleteRef.current = code;
      onComplete?.(code);
    }
  }, [values, length, onChange, onComplete]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const raw = e.target.value;
    if (!/^\d*$/.test(raw)) return;
    const char = raw.slice(-1);
    setValues((prev) => {
      const next = [...prev];
      next[idx] = char;
      if (char !== "" && idx < length - 1) {
        setTimeout(() => focus(idx + 1), 0);
      }
      return next;
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
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
      setValues((prev) => {
        const next = [...prev];
        next[idx] = "";
        return next;
      });
      if (idx > 0) {
        focus(idx - 1);
        select(idx - 1);
      }
    } else if (key === "Delete") {
      e.preventDefault();
      setValues((prev) => {
        const next = [...prev];
        next[idx] = "";
        return next;
      });
    } else if (key === "Enter") {
      e.preventDefault();
      const code = values.join("").trim();
      if (code.length === length) onKeyDown(e);
    } else if (key === "Escape") {
      e.preventDefault();
      navigate(-1);
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    idx: number,
  ) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!text) return;
    setValues((prev) => {
      const next = [...prev];
      let writeCount = 0;
      for (let i = 0; i < text.length && idx + i < length; i++) {
        next[idx + i] = text[i];
        writeCount++;
      }
      const lastIndex = Math.min(length - 1, idx + writeCount - 1);
      setTimeout(() => {
        inputsRef.current[lastIndex]?.focus();
        const joined = next.join("");
        if (joined.length === length) onComplete?.(joined);
      }, 0);
      return next;
    });
  };

  return (
    <div className="flex justify-between gap-2 md:gap-3" id="otp-container">
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          className="otp-input w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-slate-50 dark:bg-card-dark border border-slate-200 dark:border-emerald-900/30 rounded-xl focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white"
          maxLength={1}
          type="text"
          value={values[i] ?? ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          inputMode="numeric"
          name={name}
          aria-label={`digit-${i + 1}`}
          autoComplete="off"
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
