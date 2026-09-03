import React from "react";
import SiteHeader from "@/components/site/SiteHeader";
import Hero from "@/components/site/Hero";
import ServicesBar from "@/components/site/ServicesBar";

const HERO_IMAGE =
  "https://media.base44.com/images/public/6a7c04080de5f5d71af31f52/f1578be2d_generated_image.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] font-body text-white">
      <SiteHeader />
      <Hero heroImage={HERO_IMAGE} />
      <ServicesBar />
    </div>
  );
}
