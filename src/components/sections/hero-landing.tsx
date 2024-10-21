import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { RainbowButton } from "@/components/ui/rainbow-button";

import { useTranslations } from 'next-intl';

export default function HeroLanding() {
  const t = useTranslations('HeroLanding');
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <Link
          href="https://github.com/UllrAI/HeadShots.fun"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4",
          )}
          target="_blank"
        >
          <span className="mr-2">
            🚀
          </span>
          HeadShots.fun is open source on
          <Icons.github className="mx-1 size-3" />
          <span className="hidden md:inline">GitHub now!</span>
        </Link>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          {t("fun_pro_for_every_occasion")}
          {" "}
          <span className="text-gradient_indigo-purple font-extrabold">
            {t("headshots_fun")}
          </span>
        </h1>

        <p
          className="max-w-3xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          {t.rich('get_unique_portraits', {
            bold: (chunks) => <strong>{chunks}</strong>
          })}
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/register"
            prefetch={true}
          >
            <RainbowButton>
              {t("get_your_headshots")}
              <Icons.arrowRight className="ml-1 size-4" />
            </RainbowButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
