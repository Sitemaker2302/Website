import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Lock, FileText, Shield } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";

const LOGO_URL =
  "https://media.base44.com/images/public/6a7c04080de5f5d71af31f52/9975c86ce_KaishaLogo.png";

export default function SiteHeader() {
  const { lang, setLang, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  const navKeys = ["home", "about", "services", "equipment", "auctions", "shipping", "solutions", "news"];
  const navPaths = { home: "/", equipment: "/equipment" };

  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="h-12 w-12 shrink-0">
            <Image
              src={LOGO_URL}
              alt="Rayan Group logo"
              className="h-full w-full"
              fittingType="fit"
            />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold tracking-[0.2em] text-white">
              RAYAN GROUP
            </div>
            <div className="text-[10px] tracking-[0.25em] text-[#c9a063]">
              {t.slogan}
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navKeys.map((key, i) => {
            const path = navPaths[key];
            const content = (
              <>
                {t.nav[key]}
                {i === 0 && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#c9a063]" />
                )}
              </>
            );
            const cls = `relative text-[11px] font-medium tracking-[0.18em] transition-colors hover:text-[#c9a063] ${
              i === 0 ? "text-white" : "text-[#b0b0b0]"
            }`;
            return path ? (
              <Link key={key} to={path} className={cls}>{content}</Link>
            ) : (
              <a key={key} href="#" className={cls}>{content}</a>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1 text-[11px] font-medium tracking-[0.18em] text-[#b0b0b0] hover:text-white"
            >
              {lang.toUpperCase()} <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-7 w-16 border border-[#c9a063]/40 bg-[#0d0d0d] py-1 text-center">
                {["en", "jp"].map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={`block w-full text-[11px] tracking-widest hover:text-[#c9a063] ${
                      lang === l ? "text-[#c9a063]" : "text-[#b0b0b0]"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/client-login"
            className="flex items-center gap-2 border border-[#c9a063]/60 px-4 py-2 text-[10px] font-medium tracking-[0.18em] text-white transition-colors hover:bg-[#c9a063] hover:text-[#0d0d0d]"
          >
            <Lock className="h-3 w-3" />
            {t.clientLogin}
          </Link>

          <Link
            to="/accountant-portal"
            className="flex items-center gap-2 bg-[#c9a063] px-4 py-2 text-[10px] font-medium tracking-[0.18em] text-[#0d0d0d] transition-opacity hover:opacity-90"
          >
            <FileText className="h-3 w-3" />
            {t.accountantPortal}
          </Link>

          <Link
            to="/admin"
            className="hidden items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] text-[#b0b0b0] transition-colors hover:text-[#c9a063] sm:flex"
          >
            <Shield className="h-3 w-3" />
            ADMIN
          </Link>
        </div>
      </div>
    </header>
  );
}
