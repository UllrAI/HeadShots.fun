import { constructMetadata } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
  title: `Studios Dashboard – ${siteConfig.title}`,
  description: "Create and manage headshot studios",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
