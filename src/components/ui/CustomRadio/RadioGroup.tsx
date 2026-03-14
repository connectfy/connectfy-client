import { FC } from "react";

interface Props {
  options: {
    key: string;
    name: string;
    description: string;
  }[];
  value: string;
  onChange: (name: string, value: string) => void;
  name: string;
}

const RadioGroup: FC<Props> = ({ options, value, onChange, name }) => {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      {options.map((option) => {
        const isActive = value === option.key;

        return (
          <div
            key={option.key}
            onClick={() => onChange(name, option.key)}
            className={`
              flex items-center gap-3 p-4 cursor-pointer rounded-xl border-2 transition-all duration-200
              ${
                isActive
                  ? "bg-emerald-500/10 border-(--third-color)"
                  : "bg-slate-50 dark:bg-white/5 border-transparent hover:bg-slate-100 dark:hover:bg-white/10 hover:border-(--third-color)"
              }
            `}
          >
            {/* Radio Circle */}
            <div
              className={`
              relative w-5 h-5 rounded-full border-2 shrink-0 transition-colors duration-200
              ${isActive ? "border-(--third-color)" : "border-slate-300"}
            `}
            >
              <div
                className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-(--third-color) transition-transform duration-200
                ${isActive ? "scale-100" : "scale-0"}
              `}
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-left">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-1">
                {option.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                {option.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RadioGroup;
