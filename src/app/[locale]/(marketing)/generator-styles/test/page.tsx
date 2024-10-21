"use client";

import React, { useState } from 'react';
import { categories, styles, domainPath } from '@/components/shared/styles';
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function HeadshotStylePage() {
  const shuffledStyles = styles.sort(() => Math.random() - 0.5);

  return (
    <MaxWidthWrapper className="py-12">
    
      {/* styles */}
      <div className="mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {shuffledStyles.map((style, index) => (
            <div key={index} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={`${domainPath}/${style.img}`}
                    alt={`AI Headshot: ${style.prompt}`}
                    className="size-full object-cover"
                  />
                </div>
            </div>
          ))}
        </div>
      </div>

    </MaxWidthWrapper>
  );
}
