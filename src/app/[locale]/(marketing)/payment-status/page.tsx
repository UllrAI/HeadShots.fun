import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { PaymentStatus } from '@/components/payment/status';

export default async function PaymentStatusPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('payment-status');

  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="size-16 animate-spin text-primary" />
        <p className="mt-4 text-lg font-semibold text-foreground">
          {t('loading')}
        </p>
      </div>
    }>
      <PaymentStatus />
    </Suspense>
  );
}
