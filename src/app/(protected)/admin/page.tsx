import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import UsersList from "@/components/dashboard/admin-list";
import { prisma } from "@/lib/db";
import { Icons } from "@/components/shared/icons";

export const metadata = constructMetadata({
  title: "Admin – HeadShots.fun",
  description: "Admin page for only admin management.",
});

const getUserCount = async () => {
  const userCount = await prisma.user.count();
  return userCount;
};

const getStudioCount = async () => {
  const studioCount = await prisma.studio.count();
  return studioCount;
};

const getPredictionCount = async () => {
  const predictionCount = await prisma.prediction.count();
  return predictionCount;
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
        heading="Admin Panel"
        text="Access only for users with ADMIN role."
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <InfoCard link="/admin/users" value={await getUserCount()} title="Users" detail="Total users" icon={<Icons.user className="size-4 text-muted-foreground" />}   />
          <InfoCard link="/admin/studios" value={await getStudioCount()} title="Studios" detail="Total studios" icon={<Icons.dashboard className="size-4 text-muted-foreground" />} />
          <InfoCard link="/admin/predictions" value={await getPredictionCount()} title="Predictions" detail="Total bookings" icon={<Icons.photo className="size-4 text-muted-foreground" />} />
        </div>
        {/* <UsersList /> */}
      </div>
    </>
  );
}
