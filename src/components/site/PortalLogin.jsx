import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";

const LOGO_URL =
  "https://media.base44.com/images/public/6a7c04080de5f5d71af31f52/9975c86ce_KaishaLogo.png";

export default function PortalLogin({ kind }) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAccountant = kind === "accountant";
  const title = isAccountant ? t.accountantPortal : t.clientLogin;
  const subtitle = isAccountant
    ? lang === "jp"
      ? "経理担当者用ポータルへサインイン"
      : "Sign in to the accountant portal"
    : lang === "jp"
      ? "会員専用ポータルへサインイン"
      : "Sign in to the client portal";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(lang === "jp" ? "メールまたはパスワードが正しくありません。" : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0d0d0d]">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden border-r border-[#c9a063]/20 lg:block">
        <Image
          src="https://media.base44.com/images/public/6a7c04080de5f5d71af31f52/f1578be2d_generated_image.png"
          alt="Rayan Group"
          className="h-full w-full"
          fittingType="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-[#0d0d0d]/30" />
        <div className="absolute bottom-10 left-10 right-10">
          <div className="h-12 w-12">
            <Image src={LOGO_URL} alt="logo" className="h-full w-full" fittingType="fit" />
          </div>
          <div className="mt-5 font-display text-2xl font-bold tracking-[0.2em] text-white">
            RAYAN GROUP
          </div>
          <div className="mt-1 text-[11px] tracking-[0.3em] text-[#c9a063]">
            {t.slogan}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-2 text-[11px] tracking-[0.18em] text-[#b0b0b0] transition-colors hover:text-[#c9a063]"
          >
            <ArrowLeft className="h-3 w-3" />
            {lang === "jp" ? "ホームに戻る" : "BACK TO HOME"}
          </button>

          <div className="mb-8 h-12 w-12 lg:hidden">
            <Image src={LOGO_URL} alt="logo" className="h-full w-full" fittingType="fit" />
          </div>

          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm text-[#b0b0b0]">{subtitle}</p>

          <div className="mt-8 h-[2px] w-16 bg-[#c9a063]" />

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-[11px] tracking-[0.18em] text-[#b0b0b0]">
                {lang === "jp" ? "メールアドレス" : "EMAIL ADDRESS"}
              </label>
              <div className="flex items-center gap-3 border border-[#c9a063]/40 bg-[#1a1a1a] px-4 py-3 focus-within:border-[#c9a063]">
                <Mail className="h-4 w-4 text-[#c9a063]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-[#666] focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] tracking-[0.18em] text-[#b0b0b0]">
                {lang === "jp" ? "パスワード" : "PASSWORD"}
              </label>
              <div className="flex items-center gap-3 border border-[#c9a063]/40 bg-[#1a1a1a] px-4 py-3 focus-within:border-[#c9a063]">
                <Lock className="h-4 w-4 text-[#c9a063]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-[#666] focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] tracking-[0.18em]">
              <label className="flex cursor-pointer items-center gap-2 text-[#b0b0b0]">
                <input type="checkbox" className="accent-[#c9a063]" />
                {lang === "jp" ? "ログイン情報を保存" : "REMEMBER ME"}
              </label>
              <a href="#" className="text-[#c9a063] hover:underline">
                {lang === "jp" ? "パスワードをお忘れですか？" : "FORGOT PASSWORD?"}
              </a>
            </div>

            {error && (
              <div className="flex items-center gap-2 border border-red-600/50 bg-red-950/40 px-4 py-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 bg-[#c9a063] px-7 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#0d0d0d] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? lang === "jp"
                  ? "認証中..."
                  : "SIGNING IN..."
                : lang === "jp"
                  ? "サインイン"
                  : "SIGN IN"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] tracking-[0.18em] text-[#666]">
            {lang === "jp" ? "アカウントをお持ちでないですか？ " : "DON'T HAVE AN ACCOUNT? "}
            <a href={isAccountant ? "/accountant-register" : "/register"} className="text-[#c9a063] hover:underline">
              {lang === "jp" ? (isAccountant ? "経理者登録" : "会員登録") : "REGISTER"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
