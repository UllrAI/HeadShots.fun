"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";
import { userRoleSchema } from "@/lib/validations/user";

export type FormData = {
  role: UserRole;
};

export async function updateUserRole(userId: string, data: FormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Check if the current user is an admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN") {
      throw new Error("Only admins can update user roles");
    }

    const { role } = userRoleSchema.parse(data);

    // Prevent changing own role
    if (userId === session.user.id) {
      throw new Error("You cannot change your own role");
    }

    // Update the user role
    await prisma.user.update({
      where: { id: userId },
      data: { role: role },
    });

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: (error as Error).message };
  }
}
