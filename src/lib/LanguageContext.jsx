import React, { createContext, useContext, useState, useCallback } from "react";

const LanguageContext = createContext(null);

const DICT = {
  en: {
    slogan: "JAPAN QUALITY. GLOBAL TRUST.",
    nav: {
      home: "HOME",
      about: "ABOUT US",
      services: "SERVICES",
      equipment: "EQUIPMENT",
      auctions: "AUCTIONS",
      shipping: "SHIPPING",
      solutions: "SOLUTIONS",
      news: "NEWS",
    },
    clientLogin: "CLIENT LOGIN",
    accountantPortal: "ACCOUNTANT PORTAL",
    heroTitle: ["Connecting Japan", "to the World"],
    heroDesc:
      "RAYAN GROUP specializes in exporting high-quality used construction, agricultural and industrial equipment from Japan. Built on trust. Driven by quality.",
    discover: "DISCOVER MORE",
    scroll: "SCROLL",
    equipment: {
      title: "EQUIPMENT INVENTORY",
      subtitle: "Carefully selected used machinery, ready for export.",
      inquiryPrice: "Price on request",
      backToCatalog: "BACK TO CATALOG",
      specifications: "DETAILS",
      brand: "Brand",
      category: "Category",
      condition: "Condition",
      location: "Location",
      year: "Year",
      hours: "Operating Hours",
      inquireNow: "INQUIRE NOW",
      viewDetails: "VIEW DETAILS",
      notFound: "Machine not found.",
      priceLabel: "PRICE",
    },
    services: [
      { title: "GLOBAL EXPORT", desc: "Delivering quality equipment worldwide." },
      { title: "JAPAN QUALITY", desc: "Carefully selected and inspected in Japan." },
      { title: "TRUST & INTEGRITY", desc: "Honest business, long-term partnership." },
      { title: "FULL SUPPORT", desc: "From inquiry to after-sales support." },
      { title: "FLEXIBLE SOLUTIONS", desc: "Tailored solutions for your business." },
    ],
    globalExport: {
      title: "GLOBAL EXPORT",
      subtitle: "Exporting Japanese quality equipment to the world.",
      destinationsLabel: "EXPORT DESTINATIONS",
      destinations: [
        {
          name: "EGYPT",
          jpName: "エジプト",
          desc: "Serving clients across Egypt with reliable construction and agricultural machinery, shipped from Japan.",
          url: "https://rayangroupegypt.com",
        },
        {
          name: "DUBAI",
          jpName: "ドバイ",
          desc: "Our Dubai hub connects Japanese equipment to the UAE and the wider Middle East market.",
          url: "https://rayangroupdubai.com",
        },
      ],
      visitSite: "VISIT SITE",
      backHome: "BACK TO HOME",
    },
  },
  jp: {
    slogan: "日本の品質 世界の信頼",
    nav: {
      home: "ホーム",
      about: "会社案内",
      services: "サービス",
      equipment: "機械",
      auctions: "オークション",
      shipping: "輸送",
      solutions: "ソリューション",
      news: "ニュース",
    },
    clientLogin: "会員ログイン",
    accountantPortal: "経理ポータル",
    heroTitle: ["日本を世界へ", "つなぐ"],
    heroDesc:
      "RAYAN GROUPは、日本から高品質な中古建設・農業・産業用機械の輸出を専門としています。信頼を基盤に、品質で駆動する。",
    discover: "詳しく見る",
    scroll: "スクロール",
    equipment: {
      title: "機械在庫一覧",
      subtitle: "厳選された中古機械、輸出準備完了。",
      inquiryPrice: "価格はお問い合わせ",
      backToCatalog: "一覧に戻る",
      specifications: "詳細",
      brand: "メーカー",
      category: "カテゴリー",
      condition: "状態",
      location: "所在地",
      year: "年式",
      hours: "稼働時間",
      inquireNow: "お問い合わせ",
      viewDetails: "詳細を見る",
      notFound: "機械が見つかりません。",
      priceLabel: "価格",
    },
    services: [
      { title: "グローバルに輸出", desc: "世界中に品質のいい機械をお届けします。" },
      { title: "日本の品質", desc: "日本で厳選・検査された機械。" },
      { title: "信頼と誠実", desc: "誠実なビジネス、長期的なパートナーシップ。" },
      { title: "フルサポート", desc: "お問い合わせからアフターサポートまで。" },
      { title: "柔軟なソリューション", desc: "ビジネスに合わせたソリューション。" },
    ],
    globalExport: {
      title: "グローバル輸出",
      subtitle: "日本の品質機械を世界へお届けします",
      destinationsLabel: "輸出先",
      destinations: [
        {
          name: "EGYPT",
          jpName: "エジプト",
          desc: "エジプトのお客様へ、日本から信頼できる建設・農業機械をお届けします",
          url: "https://rayangroupegypt.com",
        },
        {
          name: "DUBAI",
          jpName: "ドバイ",
          desc: "ドバイ拠点から日本の機械をUAE・中東全域にお届けします",
          url: "https://rayangroupdubai.com",
        },
      ],
      visitSite: "サイトを見る",
      backHome: "ホームに戻る",
    },
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const toggle = useCallback((next) => setLang(next), []);
  const t = DICT[lang];
  return (
    <LanguageContext.Provider value={{ lang, setLang: toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) return { lang: "en", setLang: () => {}, t: DICT.en };
  return ctx;
}
