import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { pricingData } from "@/config/credits-plan";
import { ComparisonTable } from "@/components/pricing/comparison-table";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { HeaderSection } from "@/components/shared/header-section";

export const metadata = constructMetadata({
  title: `Pricing – ${siteConfig.title}`,
  description: "Explore our headshot pricing.",
});

export default async function PricingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <MaxWidthWrapper>
        <section className="flex flex-col items-center">
          <div className="mx-auto mb-12 flex w-full flex-col items-center gap-5">
            <HeaderSection
              label="Pricing"
              title="Simple, Transparent Pricing"
              subtitle="Choose the perfect plan for your needs. No hidden fees, no surprises."
            />
          </div>
          <PricingCards userId={user?.id} emailAddress={user?.email ?? undefined} pricingData={pricingData} />
          <div className="my-12 text-center">
            <p className="text-sm text-muted-foreground">
              Enjoy a 7-day risk-free trial on all plans. Full refund if no credits used.
            </p>
          </div>
          <ComparisonTable pricingData={pricingData} />
          <hr className="container" />
          <div className="mt-16 flex w-full flex-col items-center gap-2">
            <PricingFaq />
          </div>
        </section>
      </MaxWidthWrapper>
    </div>
  );
}
