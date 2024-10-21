import { BlogHeaderLayout } from "@/components/content/blog-header-layout";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

export default async function BlogLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <>
      <NextIntlClientProvider messages={messages}>
        <BlogHeaderLayout locale={locale} />
        <MaxWidthWrapper className="pb-16">{children}</MaxWidthWrapper>
      </NextIntlClientProvider>
    </>
  );
}
