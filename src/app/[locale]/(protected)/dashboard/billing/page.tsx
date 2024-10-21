import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { siteConfig } from "@/config/site";
import { CreditTransactionHistory } from "@/components/dashboard/billing-credits-list";
import { getTranslations } from "next-intl/server";

export const metadata = constructMetadata({
  title: `Billing – ${siteConfig.title}`,
  description: "Manage billing and your credits.",
});

export default async function BillingPage() {
  const user = await getCurrentUser();
  const t = await getTranslations("Credits");
  return (
    <>
      <DashboardHeader
        heading={t("billing")}
        text={t("check_your_credits_transactions_and_usage")}
      />
      <div className="grid gap-8">
        <CreditTransactionHistory />
      </div>
      <div className="my-8 text-center text-sm text-muted-foreground">
        <p>{t("if_you_have_any_questions_about_billing_please_contact_us_at")} <a href="mailto:support@headshots.fun">support@headshots.fun</a></p>
      </div>
    </>
  );
}
