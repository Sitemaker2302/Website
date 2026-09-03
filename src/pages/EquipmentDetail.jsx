import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import SiteHeader from "@/components/site/SiteHeader";
import { getMachine } from "@/lib/inventoryService";
import {
  localizeCategory,
  localizeCondition,
  localizeLocation,
  localizeAvailability,
  AVAILABILITY_STYLES,
  formatPrice,
} from "@/lib/inventoryLocalize";
import { useLanguage } from "@/lib/LanguageContext";

export default function EquipmentDetail() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const [machine, setMachine] = useState(undefined);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let activeReq = true;
    setMachine(undefined);
    getMachine(id)
      .then((data) => activeReq && setMachine(data))
      .catch(() => activeReq && setMachine(null));
    return () => {
      activeReq = false;
    };
  }, [id]);

  if (machine === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9a063]/30 border-t-[#c9a063]" />
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d0d0d] text-center">
        <p className="text-[#b0b0b0]">{t.equipment.notFound}</p>
        <Link to="/equipment" className="mt-4 text-[#c9a063] hover:underline">
          {t.equipment.backToCatalog}
        </Link>
      </div>
    );
  }

  const desc = lang === "jp" ? machine.descriptionJp || machine.description : machine.description;
  const photos = machine.photos?.length ? machine.photos : [];

  const specs = [
    { label: t.equipment.brand, value: machine.manufacturer },
    { label: t.equipment.category, value: localizeCategory(machine.category, lang) },
    { label: t.equipment.condition, value: localizeCondition(machine.condition, lang) },
    { label: t.equipment.location, value: localizeLocation(machine, lang) },
    { label: t.equipment.year, value: machine.year },
    { label: t.equipment.hours, value: machine.operatingHours },
  ].filter((s) => s.value != null && s.value !== "");

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-body text-white">
      <SiteHeader />

      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 lg:px-10 lg:pt-32">
        <Link
          to="/equipment"
          className="mb-8 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-[#b0b0b0] transition-colors hover:text-[#c9a063]"
        >
          <ArrowLeft className="h-3 w-3" />
          {t.equipment.backToCatalog}
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#c9a063]/20 bg-[#1a1a1a]">
              {photos.length ? (
                <Image src={photos[active]} alt={`${machine.manufacturer} ${machine.model}`} className="h-full w-full" fittingType="fill" />
              ) : null}
              {machine.availability === "reserved" && (
                <div className={`absolute right-0 top-0 border-b border-l px-4 py-2 text-xs font-bold tracking-[0.18em] shadow-lg ${AVAILABILITY_STYLES.reserved}`}>
                  {localizeAvailability(machine.availability, lang)}
                </div>
              )}
            </div>
            {photos.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {photos.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`relative aspect-square overflow-hidden border transition-colors ${
                      active === i ? "border-[#c9a063]" : "border-[#c9a063]/20 hover:border-[#c9a063]/60"
                    }`}
                  >
                    <Image src={url} alt="" className="h-full w-full" fittingType="fill" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="text-[11px] tracking-[0.18em] text-[#c9a063]">{machine.manufacturer}</div>
            <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
              {machine.model}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#b0b0b0]">
              {localizeLocation(machine, lang) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#c9a063]" />
                  {localizeLocation(machine, lang)}
                </span>
              )}
              <span
                className={`border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] ${AVAILABILITY_STYLES[machine.availability || "available"]}`}
              >
                {localizeAvailability(machine.availability || "available", lang)}
              </span>
            </div>

            <div className="mt-6 h-[2px] w-16 bg-[#c9a063]" />

            {desc && <p className="mt-6 text-sm leading-relaxed text-[#b0b0b0]">{desc}</p>}

            <div className="mt-8 border border-[#c9a063]/20">
              <div className="border-b border-[#c9a063]/20 bg-[#1a1a1a] px-5 py-3 text-[11px] font-semibold tracking-[0.18em] text-white">
                {t.equipment.specifications}
              </div>
              <div className="divide-y divide-[#c9a063]/10">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="text-[#b0b0b0]">{s.label}</span>
                    <span className="font-medium text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] text-[#b0b0b0]">
              <CheckCircle2 className="h-4 w-4 text-[#c9a063]" />
              {lang === "jp" ? "日本で点検済み・輸出準備完了" : "Inspected in Japan – export ready"}
            </div>

            <a
              href="/client-login"
              className="group mt-8 inline-flex items-center gap-3 bg-[#c9a063] px-7 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#0d0d0d] transition-opacity hover:opacity-90"
            >
              {t.equipment.inquireNow}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
