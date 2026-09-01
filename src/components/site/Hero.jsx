import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";

export default function Hero({ heroImage }) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0d0d0d]">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Heavy equipment with Mount Fuji"
          className="h-full w-full"
          fittingType="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/70 to-[#0d0d0d]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]/40" />
      </div>

      {/* Vertical text far right */}
      <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
        <span
          className="block text-[10px] tracking-[0.4em] text-[#c9a063]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          RAYAN GROUP CO., LTD.
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 pt-32 pb-40 lg:px-10">
        <h1 className="max-w-2xl font-display text-4xl font-bold uppercase leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {t.heroTitle[0]}
          <br />
          {t.heroTitle[1]}
        </h1>

        <div className="mt-6 h-[2px] w-24 bg-red-600" />

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#b0b0b0] sm:text-base">
          {t.heroDesc}
        </p>

        <Link
          to="/equipment"
          className="group mt-10 flex items-center gap-3 bg-[#1a1a1a] px-7 py-4 text-[11px] font-medium tracking-[0.2em] text-white transition-colors hover:bg-[#c9a063] hover:text-[#0d0d0d]"
        >
          {t.discover}
          <ArrowRight className="h-4 w-4 text-[#c9a063] transition-colors group-hover:text-[#0d0d0d]" />
        </Link>
      </div>

      {/* Scroll button */}
      <div className="absolute bottom-40 left-1/2 z-20 hidden -translate-x-1/2 lg:block">
        <button className="flex h-14 w-14 flex-col items-center justify-center rounded-full border border-[#c9a063]/50 text-[#c9a063] transition-colors hover:bg-[#c9a063] hover:text-[#0d0d0d]">
          <span className="text-[8px] tracking-[0.2em]">{t.scroll}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
