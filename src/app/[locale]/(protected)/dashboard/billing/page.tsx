import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { siteConfig } from "@/config/site";
import { CreditTransactionHistory } from "@/components/dashboard/billing-credits-list";

export const metadata = constructMetadata({
  title: `Billing – ${siteConfig.title}`,
  description: "Manage billing and your credits.",
});

export default async function BillingPage() {
  const user = await getCurrentUser();

  return (
    <>
      <DashboardHeader
        heading="Billing"
        text="Check your credits transactions and usage."
      />
      <div className="grid gap-8">
        <CreditTransactionHistory />
      </div>
      <div className="my-8 text-center text-sm text-muted-foreground">
        <p>If you have any questions about billing, please contact us at <a href="mailto:support@headshots.fun">support@headshots.fun</a></p>
      </div>
    </>
  );
}