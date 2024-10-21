import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"
import { UserAuthForm } from "@/components/forms/user-auth-form"
import { Suspense } from "react"
import { getTranslations } from 'next-intl/server';
import { unstable_setRequestLocale } from "next-intl/server";
export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default async function RegisterPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('auth');

  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        {t('login')}
      </Link>
      <div className="hidden h-full border-r border-gray-200 bg-white lg:flex lg:items-center lg:justify-center">
        <img src="/_static/register.jpg" alt="Register" className="h-auto max-h-full w-full object-contain" />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto size-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('create_an_account')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('enter_your_email_below_to_create_your_account')}
            </p>
          </div>
          <Suspense>
            <UserAuthForm type="register" />
          </Suspense>
          <p className="px-8 text-center text-xs text-muted-foreground">
            {t('by_clicking_continue_you_agree_to_our')} {" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              {t('terms_of_service')}
            </Link>
            {" "} & {" "}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              {t('privacy_policy')}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
