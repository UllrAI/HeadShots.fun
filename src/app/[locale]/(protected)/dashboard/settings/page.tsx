import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserNameForm } from "@/components/forms/user-name-form";
import { UserAvatarForm } from "@/components/forms/user-avatar-form";
import { siteConfig } from "@/config/site";
import { getTranslations } from "next-intl/server";

export const metadata = constructMetadata({
  title: `Settings – ${siteConfig.title}`,
  description: "Configure your account and website settings.",
});

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const t = await getTranslations("Settings");
  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading={t("settings")}
        text={t("manage_account_settings")}
      />
      <div className="divide-y divide-muted pb-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        <UserAvatarForm user={{ id: user.id, image: user.image || "" }} />
        <DeleteAccountSection />
      </div>
    </>
  );
}
