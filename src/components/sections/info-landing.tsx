import Image from "next/image";

import { Icons } from "@/components/shared/icons";
import { useTranslations } from "next-intl";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function InfoLanding() {
  const t = useTranslations("InfoLanding");
  
  const data = {
    image: "/_static/index/hero-landing.png",
    list: ["laptop", "settings", "cpu"],
  };

  return (
    <div className="py-10 sm:py-20">
      <MaxWidthWrapper className="grid gap-10 px-2.5 lg:grid-cols-2 lg:items-center lg:px-7">
        <div className="lg:order-1">
          <h2 className="font-heading text-2xl text-foreground md:text-4xl lg:text-[40px]">
            {t("title")}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            {t("description")}
          </p>
          <dl className="mt-6 space-y-4 leading-7">
            {data.list.map((icon, index) => {
              const Icon = Icons[icon || "arrowRight"];
              return (
                <div className="relative pl-8" key={index}>
                  <dt className="font-semibold">
                    <Icon className="absolute left-0 top-1 size-5 stroke-purple-700" />
                    <span>{t(`list.title.${index + 1}`)}</span>
                  </dt>
                  <dd className="text-sm text-muted-foreground">
                    {t(`list.description.${index + 1}`)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
        <div className="order-2 overflow-hidden rounded-xl border lg:-m-4">
          <div className="aspect-video">
            <Image
              className="size-full object-cover object-center"
              src={data.image}
              alt={t("title")}
              width={1000}
              height={500}
              priority={true}
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
