import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import UsersList from "@/components/dashboard/admin-list";
import { prisma } from "@/lib/db";

export const metadata = constructMetadata({
  title: "Users - Admin | HeadShots.fun",
  description: "Admin page for only admin management.",
});

const getUserCount = async () => {
  const userCount = await prisma.user.count();
  return userCount;
};

export default async function AdminPage() {
  // Check if there's any ADMIN user
  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });

  if (adminCount === 0) {
    // If no ADMIN, set the first user as ADMIN
    const firstUser = await prisma.user.findFirst();
    if (firstUser) {
      await prisma.user.update({
        where: { id: firstUser.id },
        data: { role: "ADMIN" },
      });
    }
  }

  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Users Admin Panel"
        text={`Total users: ${await getUserCount()}`}
      />
      <div className="flex flex-col gap-5">
        <UsersList />
      </div>
    </>
  );
}
