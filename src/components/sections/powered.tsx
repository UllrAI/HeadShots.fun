import Link from "next/link";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const logos = [
  {
    title: "TechCorp",
    href: "https://techcorp.example.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30" fill="currentColor">
        <path d="M10 15h20M20 5v20M40 5h15v20h-15zM65 5l10 10-10 10M85 5v20l15-10z"/>
      </svg>
    ),
  },
  {
    title: "DataFlow",
    href: "https://dataflow.example.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30" fill="currentColor">
        <circle cx="15" cy="15" r="10"/>
        <circle cx="60" cy="15" r="10"/>
        <circle cx="105" cy="15" r="10"/>
        <path d="M25 15h25M70 15h25"/>
      </svg>
    ),
  },
  // ... Add more logos here
];

export default function Powered() {
  return (
    <section className="py-14 text-muted-foreground">
      <MaxWidthWrapper>
        <h2 className="text-center text-sm font-semibold uppercase">
          Trusted by
        </h2>

        <div className="mt-10 grid grid-cols-2 place-items-center gap-8 md:grid-cols-4">
          {logos.slice(0, 4).map((logo) => (
            <Link
              target="_blank"
              key={logo.title}
              href={logo.href}
              aria-label={logo.title}
              className="duration-250 grayscale transition hover:text-foreground hover:grayscale-0"
            >
              {logo.icon}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 place-items-center gap-8 md:mt-10 md:grid-cols-4">
          {logos.slice(4, 8).map((logo) => (
            <Link
              target="_blank"
              key={logo.title}
              href={logo.href}
              aria-label={logo.title}
              className="duration-250 grayscale transition hover:text-foreground hover:grayscale-0"
            >
              {logo.icon}
            </Link>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
