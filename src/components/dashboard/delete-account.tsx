"use client";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { useDeleteAccountModal } from "@/components/modals/delete-account-modal";
import { Icons } from "@/components/shared/icons";
import { useTranslations } from "next-intl";

export function DeleteAccountSection() {
  const t = useTranslations("Settings");
  const { setShowDeleteAccountModal, DeleteAccountModal } =
    useDeleteAccountModal();

  return (
    <>
      <DeleteAccountModal />
      <SectionColumns
        title={t("delete_account")}
        description={t("this_is_a_danger_zone_be_careful")}
      >
        <div className="flex flex-col gap-4 rounded-xl border border-red-400 p-4 dark:border-red-900">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium">{t("are_you_sure")}</span>
            </div>
            <div className="text-balance text-sm text-muted-foreground">
              {t("permanently_delete_your_account_and_credits", {
                siteTitle: siteConfig.name,
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="destructive"
              onClick={() => setShowDeleteAccountModal(true)}
            >
              <Icons.trash className="mr-2 size-4" />
              <span>{t("delete_account")}</span>
            </Button>
          </div>
        </div>
      </SectionColumns>
    </>
  );
}
