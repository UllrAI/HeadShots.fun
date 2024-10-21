"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeaderSection } from "@/components/shared/header-section";
import { useState } from "react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from 'next-intl';

interface PricingCardsProps {
  pricingData: Array<{
    id: number;
    price: number;
    quantity: number;
  }>;
  userId?: string;
  emailAddress?: string;
}

export function PricingCards({ pricingData, userId, emailAddress }: PricingCardsProps) {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('PricingPage');
  const handlePurchase = async (plan: typeof pricingData[0], index: number) => {
    if (!userId) {
      toast.error("Please sign in to purchase credits");
      return;
    }

    setLoadingPlan(index);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(plan.price * 100) / 100, // 确保金额最多只有两位小数
          quantity: plan.quantity,
          description: `${t(`plans.${plan.id}.features`)} - ${t(`plans.${plan.id}.description`)}`,
          userId,
          emailAddress, // 添加电子邮件地址
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { checkoutUrl } = await response.json();

      if (!checkoutUrl) {
        throw new Error("Invalid checkout URL");
      }

      // 直接重定向 Stripe Checkout 页面
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to initiate checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust this value as needed
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="mx-auto mb-12 flex w-full flex-col items-center gap-5">
        <HeaderSection
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
        />
      </div>
      <div className="relative flex w-full items-center">
        <button
          onClick={() => scroll('left')}
          className="mr-2 shrink-0 rounded-full bg-white/80 p-2 shadow-md transition-colors duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800/80 dark:hover:bg-gray-800"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-6 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="grow overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
          >
            {pricingData.map((plan, index) => (
              <PricingCard
                key={index}
                plan={{
                  ...plan,
                  description: t(`plans.${plan.id}.description`),
                  features: [t(`plans.${plan.id}.features`)]
                }}
                index={index}
                handlePurchase={handlePurchase}
                isLoading={loadingPlan === index}
              />
            ))}
          </div>
        </div>
        <button
          onClick={() => scroll('right')}
          className="ml-2 shrink-0 rounded-full bg-white/80 p-2 shadow-md transition-colors duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800/80 dark:hover:bg-gray-800"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      <div className="my-10 text-center">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t('trial_section_description')}
          <br />
          {t('1_credit_1_headshot')}
        </p>
      </div>
    </>
  );
}

function PricingCard({ plan, index, handlePurchase, isLoading }) {
  const t = useTranslations('PricingPage');

  return (
    <Card className={`flex w-56 shrink-0 snap-center flex-col justify-between transition-all hover:shadow-lg ${index === 2 ? 'border-primary' : ''} relative ${index === 2 ? 'mt-4 overflow-visible' : 'mt-8'}`}>
      {index === 2 && (
        <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md">
          {t('most_popular')}
        </div>
      )}
      <CardHeader className="text-center">
        <Badge variant="outline" className="mb-2 self-center">
          {plan.quantity} {t('credits')}
        </Badge>
        <CardTitle className={`${index === 2 ? 'pb-2 text-3xl' : 'text-2xl'} font-bold`}>${plan.price}</CardTitle>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
            <li className="flex items-center text-sm">
              <svg className="mr-2 size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {plan.quantity} {t('credits')}
            </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => handlePurchase(plan, index)}
          variant={index === 2 ? "default" : "outline"}
          disabled={isLoading}
        >
          {isLoading ? t('processing') : t('purchase')}
        </Button>
      </CardFooter>
    </Card>
  );
}
