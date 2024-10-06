"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface BillingFormButtonProps {
  userId?: string;
  offer: {
    title: string;
    credits: number;
    price: number;
  };
}

export function BillingFormButton({ userId, offer }: BillingFormButtonProps) {
  const router = useRouter();

  const handleClick = async () => {
    if (userId) {
      try {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: offer.credits }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { url } = await response.json();
        if (url) {
          window.location.href = url;
        } else {
          throw new Error('No checkout URL returned');
        }
      } catch (error) {
        console.error('Error creating checkout session:', error);
        // 这里可以添加错误处理，比如显示一个错误消息给用户
      }
    } else {
      // 使用 next-auth 的 signIn 函数重定向到登录页面
      signIn();
    }
  };

  return (
    <Button onClick={handleClick} className="w-full">
      {userId ? `Buy ${offer.credits} Credits - $${offer.price}` : "Sign in to purchase"}
    </Button>
  );
}
