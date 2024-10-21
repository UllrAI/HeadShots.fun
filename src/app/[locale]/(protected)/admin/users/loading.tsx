import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function UsersLoading() {
  return (
    <>
      <DashboardHeader
        heading="Users"
        text="Check and manage your users."
      />
      <div className="flex flex-col gap-5">
        <Skeleton className="h-4 w-24" />
      </div>
    </>
  );
}
