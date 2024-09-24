import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HeaderSection } from "../shared/header-section";

const pricingFaqData = [
  {
    id: "item-1",
    question: "What is HeadShots.fun?",
    answer: "HeadShots.fun is an AI-powered platform that allows you to create unique and stunning headshots quickly and easily, personalized for every occasion.",
  },
  {
    id: "item-2",
    question: "How does the credit system work?",
    answer: "We offer various credit packages to suit different needs. You can purchase credits that can be used to generate AI headshots. The more credits you buy, the better value you get.",
  },
  {
    id: "item-3",
    question: "What's the pricing for credit packages?",
    answer: "Our pricing starts at $4.99 for 10 credits, perfect for trying out our service. We also offer larger packages, with our most popular choice being $19.99 for 100 credits, ideal for regular users.",
  },
  {
    id: "item-4",
    question: "Are there any features to help customize my headshots?",
    answer: "Yes! We offer AI-powered tools designed to make every headshot uniquely yours. You can explore various features to unleash your creativity and personalize your headshots for different occasions.",
  },
  {
    id: "item-5",
    question: "How fast is the AI technology used for generating headshots?",
    answer: "We use the fastest AI technology available to ensure quick and efficient headshot generation. Our goal is to provide you with stunning results in the shortest time possible.",
  },
  {
    id: "item-6",
    question: "What kind of photos should I upload to the platform?",
    answer: "We recommend that you upload a variety of photos to ensure that your avatar is as accurate as possible. This may include close-up shots of your face, photos of your profile, and full-body shots. It's important to make sure that your photos are clear and of high quality, and that they do not include any other people or animals. We also recommend that you include a range of expressions, locations, backgrounds, and perspectives in your photos to create the most accurate avatar possible.",
  },
  {
    id: "item-7",
    question: "How similar will the avatar be to my appearance?",
    answer: "The accuracy of your avatar will largely depend on the number and variety of the photos that you provide. The better and more diverse the photos are, the easier it will be for the AI to understand and replicate your facial and bodily characteristics. As a result, your avatar will be more likely to closely resemble your actual appearance!",
  },
];

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-2">
      <HeaderSection
        label="HeadShots.fun"
        title="Frequently Asked Questions"
        subtitle="Please check our FAQ for quick answers to common questions. Feel free to reach out for personalized assistance."
      />

      <Accordion type="single" collapsible className="my-12 w-full">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
