import { FC } from "react";

interface Props {
  color?: string;
}

const EyeCloseIcon: FC<Props> = ({ color = "var(--border-color)" }) => {
  return (
    <svg
      data-v-6433c584=""
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-eye-closed-icon lucide-eye-closed"
      aria-hidden="true"
      style={{ color: color }}
    >
      <path d="m15 18-.722-3.25"></path>
      <path d="M2 8a10.645 10.645 0 0 0 20 0"></path>
      <path d="m20 15-1.726-2.05"></path>
      <path d="m4 15 1.726-2.05"></path>
      <path d="m9 18 .722-3.25"></path>
    </svg>
  );
};

export default EyeCloseIcon;
