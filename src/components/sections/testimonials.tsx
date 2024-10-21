import Image from "next/image";

import { HeaderSection } from "@/components/shared/header-section";
import { useTranslations } from "next-intl";

const testimonials = [
  {
    id: 1,
    name: "Sarah Green",
    job: "Portrait Photographer",
    image: "https://randomuser.me/api/portraits/women/10.jpg"
  },
  {
    id: 2,
    name: "Laura Bennett",
    job: "Digital Marketing Specialist",
    image: "https://randomuser.me/api/portraits/women/14.jpg"
  },
  {
    id: 3,
    name: "Michael Carter",
    job: "Brand Strategist",
    image: "https://randomuser.me/api/portraits/men/11.jpg"
  },
  {
    id: 4,
    name: "Olivia Turner",
    job: "Startup Founder",
    image: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    id: 5,
    name: "David Harris",
    job: "Creative Director",
    image: "https://randomuser.me/api/portraits/men/13.jpg"
  },
  {
    id: 6,
    name: "Chris Wilson",
    job: "Full-Stack Developer",
    image: "https://randomuser.me/api/portraits/men/15.jpg"
  },
  {
    id: 7,
    name: "Emma Collins",
    job: "Marketing Coordinator",
    image: "https://randomuser.me/api/portraits/women/16.jpg"
  },
  {
    id: 8,
    name: "John Doe",
    job: "CEO",
    image: "https://randomuser.me/api/portraits/men/19.jpg"
  },
];

export default function Testimonials() {
  const t = useTranslations("Testimonials");

  return (
    <section>
      <div className="container flex max-w-6xl flex-col gap-10 py-16 sm:gap-y-16">
        <HeaderSection
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <span className="sr-only text-center text-muted-foreground">
          Please replace the following placeholders when deploying as your own headshots generator.
        </span>
        <div className="column-1 gap-5 space-y-5 md:columns-2 lg:columns-3 ">
          {testimonials.map((item) => (
            <div className="break-inside-avoid" key={item.name}>
              <div className="relative rounded-xl border bg-muted/25">
                <div className="flex flex-col px-4 py-5 sm:p-6">
                  <div>
                    <div className="relative mb-4 flex items-center gap-3">
                      <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-base">
                        <Image
                          width={100}
                          height={100}
                          className="size-full rounded-full border"
                          src={item.image}
                          alt={item.name}
                        />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.job}
                        </p>
                      </div>
                    </div>
                    <q className="text-muted-foreground">{t(`reviews.${item.id}`)}</q>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
