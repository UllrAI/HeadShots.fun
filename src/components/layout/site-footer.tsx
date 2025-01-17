import * as React from "react";
import Link from "next/link";
import LocaleSwitcher from "@/components/locale/locale-switcher";
import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Icons } from "../shared/icons";
import { useTranslations } from "next-intl";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations('sitefooter');
  return (
    <footer className={cn("border-t", className)}>
      <div className="container grid max-w-6xl grid-cols-2 gap-6 py-14 md:grid-cols-5">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-sm font-medium text-foreground">
              {t(`sections.${section.title}`)}
            </span>
            <ul className="mt-4 list-inside space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {t(`links.${link.title}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-full flex flex-col items-end sm:col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center space-x-1.5">
            <Icons.logo className="size-6 lg:size-10" />
            <span className="font-urban text-lg font-bold lg:text-3xl">
              {siteConfig.name}
            </span>
          </Link>
          <span className="mt-2 text-xs text-muted-foreground">
            {t('copyright')}
          </span> 
        </div>
      </div>

      <div className="border-t py-4">
        <div className="container flex max-w-6xl items-center justify-between">
          <div className="text-left text-sm text-muted-foreground">
            <span className="font-medium">{t('built_by')}{" "}</span>
            <Link
              href="https://headshot.cv/?from=opensource-footer"
              target="_blank"
              className="font-medium underline underline-offset-4"
            >
              HeadShots.fun
            </Link>
            <span className="mr-2"> , </span>

            <span className="font-medium">{t('open_source_by')}{" "}</span>
            <Link
              href="https://ullrai.com"
              target="_blank"
              className="font-medium underline underline-offset-4"
            >
              UllrAI Lab
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              <Icons.github className="size-5" />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
