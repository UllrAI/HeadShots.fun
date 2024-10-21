import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { unstable_setRequestLocale } from "next-intl/server";
import { HeaderSection } from "../shared/header-section";
import { useTranslations } from 'next-intl';

export function PricingFaq({ locale }) {
  const t = useTranslations('PricingPageFAQ');
  unstable_setRequestLocale(locale);
  const faqData = t.raw('qa') as [string, string][];

  return (
    <section className="container max-w-4xl py-2">
      <HeaderSection
        label={t('label')}
        title={t('title')}
        // subtitle={t('subtitle')}
      />

      <Accordion type="single" collapsible className="my-12 w-full">
        {faqData.map(([question, answer], index) => (
          <AccordionItem key={index} value={index.toString()}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
