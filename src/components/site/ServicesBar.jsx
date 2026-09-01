import React from "react";
import { Link } from "react-router-dom";
import { Globe, ShieldCheck, Handshake, Headphones, Puzzle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const ICONS = [Globe, ShieldCheck, Handshake, Headphones, Puzzle];

export default function ServicesBar() {
  const { t } = useLanguage();

  return (
    <div className="relative z-20 -mt-px bg-[#0d0d0d] border-t border-[#c9a063]/20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-[#c9a063]/15 md:grid-cols-3 lg:grid-cols-5">
        {t.services.map(({ title, desc }, i) => {
          const Icon = ICONS[i];
          const content = (
            <div
              className="group flex h-full flex-col items-center gap-3 bg-[#0d0d0d] px-6 py-8 text-center transition-colors hover:bg-[#1a1a1a]"
            >
              <Icon className="h-7 w-7 text-[#c9a063] transition-transform group-hover:scale-110" />
              <div className="text-[11px] font-semibold tracking-[0.18em] text-white">
                {title}
              </div>
              <div className="text-[11px] leading-relaxed text-[#b0b0b0]">{desc}</div>
            </div>
          );
          return i === 0 ? (
            <Link key={title} to="/global-export" className="block">
              {content}
            </Link>
          ) : (
            <div key={title} className="bg-[#0d0d0d]">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
