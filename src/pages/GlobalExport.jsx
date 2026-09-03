import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Globe, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import SiteHeader from "@/components/site/SiteHeader";
import { useLanguage } from "@/lib/LanguageContext";

const EGYPT_IMAGE =
  "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80";
const DUBAI_IMAGE =
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80";

export default function GlobalExport() {
  const { t, lang } = useLanguage();
  const g = t.globalExport;
  const imgs = [EGYPT_IMAGE, DUBAI_IMAGE];

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-body text-white">
      <SiteHeader />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-[#c9a063]/20 pb-16 pt-36 lg:pt-44">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/40 to-transparent" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-[#b0b0b0] transition-colors hover:text-[#c9a063]"
          >
            <ArrowLeft className="h-3 w-3" />
            {g.backHome}
          </Link>
          <div className="flex items-center gap-3 text-[#c9a063]">
            <Globe className="h-5 w-5" />
            <span className="text-[11px] tracking-[0.3em]">{g.destinationsLabel}</span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            {g.title}
          </h1>
          <div className="mt-6 h-[2px] w-24 bg-[#c9a063]" />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#b0b0b0] sm:text-base">
            {g.subtitle}
          </p>
        </div>
      </section>

      {/* Destinations */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {g.destinations.map((d, i) => (
            <div
              key={d.name}
              className="group flex flex-col overflow-hidden border border-[#c9a063]/20 bg-[#1a1a1a] transition-colors hover:border-[#c9a063]/60"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src={imgs[i]}
                  alt={lang === "jp" ? d.jpName : d.name}
                  className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                  fittingType="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/20 to-transparent" />
                <div className="absolute bottom-5 left-5 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#c9a063]" />
                  <span className="font-display text-2xl font-bold uppercase tracking-wide text-white">
                    {lang === "jp" ? d.jpName : d.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <p className="text-sm leading-relaxed text-[#b0b0b0]">{d.desc}</p>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn mt-7 inline-flex items-center gap-3 self-start bg-[#c9a063] px-6 py-3 text-[11px] font-semibold tracking-[0.2em] text-[#0d0d0d] transition-opacity hover:opacity-90"
                >
                  {g.visitSite}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
