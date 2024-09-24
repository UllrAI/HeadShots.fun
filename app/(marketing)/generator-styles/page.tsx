"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories, styles, domainPath } from '@/components/shared/styles';
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { HeaderSection } from "@/components/shared/header-section";
import CTA from "@/components/sections/CTA";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HeadshotStylePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredStyles = selectedCategory === 'all'
    ? styles
    : styles.filter(style => style.category === selectedCategory);

  return (
    <MaxWidthWrapper className="py-12">
      <HeaderSection
        label="HeadShots.fun Styles"
        title="Versatile Headshot Styles for Any Occasion"
        subtitle="Discover our diverse collection of AI-generated headshot styles. Quick, easy, and personalized just for you!"
      />
      {/* categories */}
      <div className="mt-12">
        <div className="mx-auto flex w-full  flex-wrap items-center justify-center gap-2">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium",
                selectedCategory === category.id ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground"
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      {/* styles */}
      <div className="mt-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {filteredStyles.map((style, index) => (
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
