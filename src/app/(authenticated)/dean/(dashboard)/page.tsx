"use client";
import React from "react";
import usePrograms from "@/hooks/shared/useProgram";
import useDepartments from "@/hooks/admin/useDepartment";
import { Skeleton } from "@/components/ui/skeleton";
import CustomCard2 from "@/components/commons/card/CustomCard2";
import DepartmentTable from "@/components/dean-components/table/DepartmentTable";
import useProgramProposals from "@/hooks/department/useProgramProposal";

const DashboardPage = () => {
  const {
    programs,
    isLoading: isProgramLoading,
    error: programError,
  } = usePrograms();

  const {
    departments,
    isLoading: isDepartmentLoading,
    error: departmentError,
  } = useDepartments({ role: "dean" });

  const activePrograms = programs?.filter(
    (program) => program.status === "active"
  );
  // const pendingPrograms = programs?.filter(
  //   (program) => program.status === "pending"
  // );
  const {
    programProposals,
    isLoading: isProposalLoading,
    error: proposalError,
  } = useProgramProposals({ role: "dean" });

  const proposalsForReview = programProposals?.filter(
    (proposal) => proposal.status === "review"
  );

  if (programError) {
    return <div>Failed to load programs</div>;
  }

  if (departmentError) {
    return <div>Failed to load departments</div>;
  }

  if (proposalError) {
    return <div>Failed to load program proposals</div>;
  }

  return (
    <div className="grid grid-rows-1 content-center gap-8">
      <div className="flex flex-col md:flex-row justify-evenly gap-2">
        {isProgramLoading || isProposalLoading ? (
          <>
            <Skeleton className="w-full h-40" />
            <Skeleton className="w-full h-40" />
          </>
        ) : (
          <>
            <CustomCard2
              title="All Programs"
              value={activePrograms?.length || 0}
              description="Total number of approved programs in your faculty"
            />
            <CustomCard2
              title="Pending Programs"
              value={proposalsForReview?.length || 0}
              description="Total number of programs that is yet to be approved and is ready for review"
            />
          </>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Departments</h2>
        {isDepartmentLoading ? (
          <Skeleton className="w-full h-64" />
        ) : (
          <DepartmentTable
            departments={departments || []}
            programProposals={programProposals || []}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
