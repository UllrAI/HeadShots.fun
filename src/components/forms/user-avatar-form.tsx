"use client";

import { useState, useTransition } from "react";
import { updateUserAvatar, type FormData } from "@/actions/update-user-avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { userAvatarSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarFormProps {
  user: Pick<User, "id" | "image">;
}

export function UserAvatarForm({ user }: UserAvatarFormProps) {
  const t = useTranslations("Settings");
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserAvatarWithId = updateUserAvatar.bind(null, user.id);

  const [avatarPreview, setAvatarPreview] = useState(user?.image || "");

  const checkUpdate = (value) => {
    setUpdated(user.image !== value);
    setAvatarPreview(value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAvatarSchema),
    defaultValues: {
      image: user?.image || "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status } = await updateUserAvatarWithId(data);

      if (status !== "success") {
        toast.error(t("settings.something_went_wrong"), {
          description: t("settings.your_avatar_was_not_updated_please_try_again"),
        });
      } else {
        await update();
        setUpdated(false);
        toast.success(t("settings.your_avatar_has_been_updated"));
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title={t("your_avatar")}
        description={t("please_enter_a_display_avatar_you_are_comfortable_with")}
      >
        <div className="flex w-full items-center gap-2">
          <Avatar className="size-10 bg-gray-50">
            <AvatarImage alt="Avatar preview" src={avatarPreview} />
          </Avatar>
          <Label className="sr-only" htmlFor="name">
            {t("your_avatar")}
          </Label>
          <Input
            id="image"
            className="flex-1"
            size={32}
            {...register("image")}
            onChange={(e) => checkUpdate(e.target.value)}
          />
          <Button
            type="submit"
            variant={updated ? "default" : "disable"}
            disabled={isPending || !updated}
            className="w-[67px] shrink-0 px-0 sm:w-[130px]"
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <p>
                {t("save")}
              </p>
            )}
          </Button>
        </div>
        <div className="flex flex-col justify-between p-1">
          {errors?.image && (
            <p className="pb-0.5 text-[13px] text-destructive">
              {errors.image.message}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">
            {t("max_255_characters")}
          </p>
        </div>
      </SectionColumns>
    </form>
  );
}