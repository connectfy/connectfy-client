import React from "react";
import "./authSidebar.style.css";
import MainIcon from "@/assets/icons/MainIcon.tsx";
// import MainIcon from "@/assets/icons/MainIcon.tsx";

interface IProps {
  colors: Record<string, any>;
}

const AuthSidebar: React.FC<IProps> = ({ colors }) => {
  return (
    <div
      className="relative hidden w-full lg:flex lg:w-1/2 xl:w-7/12 overflow-hidden items-center justify-center p-16"
      style={{
        // Birinci şəkildəki o dərin işıq effekti
        background: `radial-gradient(circle at 0% 0%, #0f3524 0%, #05180f 40%, #020a06 100%)`,
      }}
    >
      {/* Arxa plandakı dekorativ parıltı (Glow) */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none mix-blend-screen"
        style={{ background: colors.primary }}
      ></div>

      <div className="relative z-10 w-full max-w-xl flex flex-col justify-center">
        {/* 1. Logo Hissəsi */}
        <div className="flex items-center gap-3 mb-10">
          <MainIcon
            className="size-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]"
            styles={{
              backgroundColor: colors.primary,
              color: "#ffffff",
              width: 45,
              height: 45,
              padding: 8,
            }}
          />
          <h2 className="text-3xl font-extrabold tracking-tighter text-white">
            Connectfy
          </h2>
        </div>

        {/* 2. Böyük Başlıq (Typography) */}
        <div className="space-y-8 mb-16">
          <h1 className="text-white text-6xl xl:text-[5.5rem] font-[900] leading-[0.9] tracking-[-0.04em]">
            Connect.
            <br />
            Collaborate.
            <br />
            Create.
          </h1>
          <p
            className="text-xl font-medium max-w-md leading-relaxed"
            style={{ color: "#4ade80" }} // Primary rəngin bir ton açığı (mətn üçün)
          >
            The minimalist workspace designed for modern communities and
            high-impact teams.
          </p>
        </div>

        {/* 3. Glass Card & Custom Dot Logo */}
        <div
          className="w-full aspect-video rounded-[32px] border backdrop-blur-md overflow-hidden flex items-center justify-center relative group"
          style={{
            backgroundColor: colors.bgGlass,
            borderColor: colors.borderGlass,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Kartın içindəki işıq effekti */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          {/* Nöqtəli Logo (Grain/Dot Grid) */}
          <div className="relative z-10 flex flex-col gap-3 opacity-80 group-hover:scale-110 transition-transform duration-500">
            {/* 3 sətirlik nöqtələr */}
            <div className="flex gap-3 justify-center">
              <div
                className="size-4 rounded-full opacity-30"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div
                className="size-4 rounded-full opacity-60"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div
                className="size-4 rounded-full opacity-30"
                style={{ backgroundColor: colors.primary }}
              ></div>
            </div>
            <div className="flex gap-3 justify-center">
              <div
                className="size-4 rounded-full opacity-60"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div
                className="size-4 rounded-full opacity-100 shadow-[0_0_15px_rgba(52,211,153,0.6)]"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div
                className="size-4 rounded-full opacity-60"
                style={{ backgroundColor: colors.primary }}
              ></div>
            </div>
            <div className="flex gap-3 justify-center">
              <div
                className="size-4 rounded-full opacity-30"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div
                className="size-4 rounded-full opacity-60"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div
                className="size-4 rounded-full opacity-30"
                style={{ backgroundColor: colors.primary }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSidebar;
