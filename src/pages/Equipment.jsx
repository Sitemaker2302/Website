import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import SiteHeader from "@/components/site/SiteHeader";
import { listMachines } from "@/lib/inventoryService";
import {
  localizeCategory,
  localizeLocation,
  localizeAvailability,
  AVAILABILITY_STYLES,
  formatPrice,
} from "@/lib/inventoryLocalize";
import { useLanguage } from "@/lib/LanguageContext";

export default function Equipment() {
  const { t, lang } = useLanguage();
  const [machines, setMachines] = useState(null);

  useEffect(() => {
    let active = true;
    listMachines()
      .then((data) => active && setMachines(data))
      .catch(() => active && setMachines([]));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-body text-white">
      <SiteHeader />

      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 lg:px-10 lg:pt-32">
        <div className="border-b border-[#c9a063]/20 pb-8">
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            {t.equipment.title}
          </h1>
          <div className="mt-4 h-[2px] w-16 bg-[#c9a063]" />
          <p className="mt-5 max-w-2xl text-sm text-[#b0b0b0]">{t.equipment.subtitle}</p>
        </div>

        {machines === null ? (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9a063]/30 border-t-[#c9a063]" />
          </div>
        ) : machines.length === 0 ? (
          <div className="mt-16 text-center text-sm text-[#b0b0b0]">
            {lang === "jp" ? "現在、在庫がありません。" : "No machines available right now."}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {machines
              .filter((m) => m.availability !== "sold")
              .map((m) => (
                <Link
                  key={m.id}
                  to={`/equipment/${m.id}`}
                  className="group flex flex-col overflow-hidden border border-[#c9a063]/20 bg-[#1a1a1a] transition-colors hover:border-[#c9a063]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0d0d0d]">
                    <Image
                      src={m.photos?.[0]}
                      alt={`${m.manufacturer} ${m.model}`}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                      fittingType="fill"
                    />
                    <div className="absolute left-0 top-0 bg-[#c9a063] px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#0d0d0d]">
                      {localizeCategory(m.category, lang)}
                    </div>
                    {m.availability && m.availability !== "available" && (
                      <div
                        className={`absolute right-0 top-0 border-b border-l px-4 py-2 text-xs font-bold tracking-[0.18em] shadow-lg ${AVAILABILITY_STYLES[m.availability]}`}
                      >
                        {localizeAvailability(m.availability, lang)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="text-[11px] tracking-[0.18em] text-[#c9a063]">{m.manufacturer}</div>
                    <h2 className="mt-1 font-display text-lg font-bold text-white">{m.model}</h2>

                    {(m.location || m.locationEn) && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#b0b0b0]">
                        <MapPin className="h-3 w-3 text-[#c9a063]" />
                        {localizeLocation(m, lang)}
                      </div>
                    )}

                    <div className="mt-auto flex items-center gap-2 pt-5 text-[11px] font-medium tracking-[0.18em] text-white">
                      {t.equipment.viewDetails}
                      <ArrowRight className="h-4 w-4 text-[#c9a063] transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
