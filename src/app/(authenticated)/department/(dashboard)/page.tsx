"use client";
import React from "react";
import usePrograms from "@/hooks/department/useProgram";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";
import { Skeleton } from "@/components/ui/skeleton";
import CustomCard2 from "@/components/commons/card/CustomCard2";

const DashboardPage = () => {
  const {
    programs,
    isLoading: isProgramLoading,
    error: programError,
  } = usePrograms();
  const { session } = useAuth() as { session: Session | null };

  if (isProgramLoading) {
    return <div>Loading Program</div>;
  }
  if (programError) {
    return <div>failed to load programs</div>;
  }

  const departmentPrograms = programs?.filter(
    (program) => program.department.id === session?.Department?.id
  );
  const activePrograms = departmentPrograms?.filter(
    (program) => program.status === "active"
  );
  const pendingPrograms = departmentPrograms?.filter(
    (program) => program.status === "pending"
  );
  return (
    <div className="grid grid-rows-1 content-center">
      <div className="flex flex-col md:flex-row justify-evenly gap-2 ">
        {isProgramLoading ? (
          <>
            <Skeleton className="w-full h-52" />
            <Skeleton className="w-full h-52" />
          </>
        ) : (
          <>
            <CustomCard2
              title="All Programs"
              value={activePrograms?.length || 0}
              description="Total number of approved programs in your department"
            />
            <CustomCard2
              title="Pending Programs"
              value={pendingPrograms?.length || 0}
              description="Total number of programs that is yet to be approved by the dean"
            />
          </>
        )}
      </div>
      <div className="pt-8">
        <h2 className="font-semibold">Programs</h2>
      </div>
    </div>
  );
};

export default DashboardPage;
