import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function StudiosLoading() {
  return (
    <>
      <DashboardHeader
        heading="Studios"
        text="Check and manage your studios."
      />
      <div className="flex flex-col gap-5">
        <Skeleton className="h-4 w-24" />
      </div>
    </>
  );
}
