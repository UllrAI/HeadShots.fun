import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { styles, domainPath } from '@/components/shared/styles';
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { HeaderSection } from "@/components/shared/header-section";
import CTA from "@/components/sections/CTA";
import { unstable_setRequestLocale } from "next-intl/server";

export default function HeadshotStylePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <MaxWidthWrapper className="py-12">
      <HeaderSection
        label={`HeadShots${locale === 'zh-hans' ? '·' : '.'}fun Styles`}
        title="Versatile Headshot Styles"
        subtitle="Discover our diverse collection of AI-generated headshot styles. Quick, easy, and personalized just for you!"
      />
      {/* styles */}
      <div className="mt-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {styles.map((style, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={`${domainPath}/${style.img}`}
                    alt={`AI Headshot: ${style.prompt}`}
                    className="size-full object-cover"
                  />
                  {style.hot && (
                    <Badge variant="secondary" className="absolute right-2 top-2">HOT</Badge>
                  )}
                  {style.isNew && (
                    <Badge variant="destructive" className="absolute left-2 top-2">NEW</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-center text-sm font-medium">{style.name}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <CTA />
    </MaxWidthWrapper>
  );
}
