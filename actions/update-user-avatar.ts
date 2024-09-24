"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { userAvatarSchema } from "@/lib/validations/user";
import { revalidatePath } from "next/cache";

export type FormData = {
  image: string;
};

export async function updateUserAvatar(userId: string, data: FormData) {
  try {
    const session = await auth()

    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const { image } = userAvatarSchema.parse(data);

    // Update the user avatar.
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image: image,
      },
    })

    revalidatePath('/dashboard/settings');
    return { status: "success" };
  } catch (error) {
    return { status: "error" }
  }
}