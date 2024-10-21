import { unstable_setRequestLocale } from "next-intl/server";

import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import StepsSection from "@/components/sections/steps";
import PreviewLanding from "@/components/sections/preview-landing";
import Testimonials from "@/components/sections/testimonials";
import CTA from "@/components/sections/CTA";

export default function IndexPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      {/* <Powered /> */}
      <StepsSection />
      <BentoGrid />
      <InfoLanding/>
      <Features />
      <Testimonials />
      <CTA />
    </>
  );
}
