import Image from "next/image";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function PreviewLanding() {
  return (
    <div className="pb-6 sm:pb-16">
      <MaxWidthWrapper>
        <div className="rounded-xl md:bg-muted/30 md:p-3.5 md:ring-1 md:ring-inset md:ring-border">
          <div className="relative aspect-video overflow-hidden rounded-xl border md:rounded-lg">
            <a href="/generator-styles">
              <Image
                className="object-cen size-full object-cover dark:opacity-75"
                src="/_static/index/preview-landing.png"
                alt="preview landing"
                width={1260}
                height={840}
                priority={true}
              />
            </a>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
