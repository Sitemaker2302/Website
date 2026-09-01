import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, User, Phone, Building2, Mail, Lock, ArrowRight, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/LanguageContext";

const LOGO_URL =
  "https://media.base44.com/images/public/6a7c04080de5f5d71af31f52/9975c86ce_KaishaLogo.png";
const BRAND_IMG =
  "https://media.base44.com/images/public/6a7c04080de5f5d71af31f52/f1578be2d_generated_image.png";

const jp = (lang, en, ja) => (lang === "jp" ? ja : en);

export default function PortalRegister({ kind }) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const isAccountant = kind === "accountant";

  const [form, setForm] = useState({ name: "", phone: "", company: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const title = isAccountant ? jp(lang, "ACCOUNTANT REGISTRATION", "経理者登録") : jp(lang, "MEMBER REGISTRATION", "会員登録");
  const subtitle = isAccountant
    ? jp(lang, "Create an accountant portal account", "経理者ポータル用アカウントを作成")
    : jp(lang, "Create your member account", "会員アカウントを作成");
  const loginLink = isAccountant ? "/accountant-portal" : "/client-login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError(jp(lang, "Passwords do not match", "パスワードが一致しません"));
      return;
    }
    if (form.password.length < 6) {
      setError(jp(lang, "Password must be at least 6 characters", "パスワードは6文字以上で入力してください"));
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email: form.email, password: form.password });
      setShowOtp(true);
    } catch (err) {
      setError(err?.message || jp(lang, "Registration failed", "登録に失敗しました"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email: form.email, otpCode });
      if (result?.access_token) base44.auth.setToken(result.access_token);
      // Persist profile data (name/phone/company/accountType) on the user record.
      try {
        await base44.auth.updateMe({
          name: form.name,
          phone: form.phone,
          company: form.company,
          accountType: kind,
        });
      } catch {
        /* profile save is best-effort; account is already created */
      }
      window.location.href = loginLink;
    } catch (err) {
      setError(err?.message || jp(lang, "Invalid verification code", "認証コードが正しくありません"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(form.email);
      toast({ title: jp(lang, "Code sent", "コードを送信しました"), description: jp(lang, "Check your email for the new code.", "メールで新しいコードを確認してください。") });
    } catch (err) {
      setError(err?.message || jp(lang, "Failed to resend code", "コードの再送信に失敗しました"));
    }
  };

  const field = (icon, k, type, placeholder, label) => (
    <div>
      <label className="mb-2 block text-[11px] tracking-[0.18em] text-[#b0b0b0]">{label}</label>
      <div className="flex items-center gap-3 border border-[#c9a063]/40 bg-[#1a1a1a] px-4 py-3 focus-within:border-[#c9a063]">
        {icon}
        <input
          type={type}
          required
          value={form[k]}
          onChange={(e) => set(k, e.target.value)}
          className="w-full bg-transparent text-sm text-white placeholder:text-[#666] focus:outline-none"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-[#0d0d0d]">
      <div className="relative hidden w-1/2 overflow-hidden border-r border-[#c9a063]/20 lg:block">
        <Image src={BRAND_IMG} alt="Rayan Group" className="h-full w-full" fittingType="fill" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-[#0d0d0d]/30" />
        <div className="absolute bottom-10 left-10 right-10">
          <div className="h-12 w-12"><Image src={LOGO_URL} alt="logo" className="h-full w-full" fittingType="fit" /></div>
          <div className="mt-5 font-display text-2xl font-bold tracking-[0.2em] text-white">RAYAN GROUP</div>
          <div className="mt-1 text-[11px] tracking-[0.3em] text-[#c9a063]">{t.slogan}</div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <button onClick={() => navigate("/")} className="mb-8 flex items-center gap-2 text-[11px] tracking-[0.18em] text-[#b0b0b0] hover:text-[#c9a063]">
            <ArrowLeft className="h-3 w-3" /> {jp(lang, "BACK TO HOME", "ホームに戻る")}
          </button>
          <div className="mb-8 h-12 w-12 lg:hidden"><Image src={LOGO_URL} alt="logo" className="h-full w-full" fittingType="fit" /></div>

          {showOtp ? (
            <>
              <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
                {jp(lang, "VERIFY EMAIL", "メール認証")}
              </h1>
              <p className="mt-2 text-sm text-[#b0b0b0]">{jp(lang, `We sent a code to ${form.email}`, `${form.email} にコードを送信しました`)}</p>
              <div className="mt-8 h-[2px] w-16 bg-[#c9a063]" />
              <div className="mt-8 flex justify-center">
                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
                  <InputOTPGroup>
                    {[0,1,2,3,4,5].map((i) => <InputOTPSlot key={i} index={i} className="border-[#c9a063]/40 bg-[#1a1a1a] text-white" />)}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {error && <div className="mt-5 flex items-center gap-2 border border-red-600/50 bg-red-950/40 px-4 py-3 text-xs text-red-300"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
              <button onClick={handleVerify} disabled={loading || otpCode.length < 6} className="group mt-6 flex w-full items-center justify-center gap-3 bg-[#c9a063] px-7 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#0d0d0d] hover:opacity-90 disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : jp(lang, "VERIFY", "認証する")}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
              <p className="mt-5 text-center text-[11px] tracking-[0.18em] text-[#666]">
                {jp(lang, "Didn't receive the code? ", "コードが届かないですか？ ")}
                <button onClick={handleResend} className="text-[#c9a063] hover:underline">{jp(lang, "RESEND", "再送信")}</button>
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">{title}</h1>
              <p className="mt-2 text-sm text-[#b0b0b0]">{subtitle}</p>
              <div className="mt-8 h-[2px] w-16 bg-[#c9a063]" />

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {field(<User className="h-4 w-4 text-[#c9a063]" />, "name", "text", jp(lang, "Your name", "氏名"), jp(lang, "NAME", "名前"))}
                {field(<Phone className="h-4 w-4 text-[#c9a063]" />, "phone", "tel", jp(lang, "+81...", "090-XXXX-XXXX"), jp(lang, "PHONE NUMBER", "電話番号"))}
                {field(<Building2 className="h-4 w-4 text-[#c9a063]" />, "company", "text", jp(lang, "Company name", "会社名"), jp(lang, "COMPANY", "会社名"))}
                {field(<Mail className="h-4 w-4 text-[#c9a063]" />, "email", "email", "you@example.com", jp(lang, "EMAIL ADDRESS", "メールアドレス"))}
                {field(<Lock className="h-4 w-4 text-[#c9a063]" />, "password", "password", "••••••••", jp(lang, "PASSWORD", "パスワード"))}
                {field(<Lock className="h-4 w-4 text-[#c9a063]" />, "confirm", "password", "••••••••", jp(lang, "CONFIRM PASSWORD", "パスワード確認"))}

                {error && <div className="flex items-center gap-2 border border-red-600/50 bg-red-950/40 px-4 py-3 text-xs text-red-300"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}

                <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-3 bg-[#c9a063] px-7 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#0d0d0d] hover:opacity-90 disabled:opacity-50">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="h-4 w-4" />{jp(lang, "CREATE ACCOUNT", "アカウント作成")}</>}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <p className="mt-6 text-center text-[11px] tracking-[0.18em] text-[#666]">
                {jp(lang, "ALREADY HAVE AN ACCOUNT? ", "アカウントをお持ちですか？ ")}
                <a href={loginLink} className="text-[#c9a063] hover:underline">{jp(lang, "SIGN IN", "サインイン")}</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
