import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, FileEdit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import ProgramCard from "../commons/card/ProgramCard";
import usePrograms from "@/hooks/shared/useProgram";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";
import { useAuth } from "@/hooks/useAuth";
import useProgramProposals from "@/hooks/department/useProgramProposal";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  filterActivePrograms,
  getDepartmentProgramIds,
} from "@/app/utils/department/programFilter";

export default function ProgramTabs() {
  const { programs = [], isLoading: programsLoading } = usePrograms();
  const { programProposals = [], isLoading: proposalsLoading } =
    useProgramProposals();
  const { session } = useAuth() as { session: Session | null };
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");

  // Make sure we have session and Department.id before filtering
  const departmentId = session?.Department?.id;

  // get all the programs that has the same department with the session
  // Filter active programs by department - with null checks
  const activePrograms = filterActivePrograms(programs, departmentId);

  // Get all department program IDs for filtering proposals
  const departmentProgramIds = getDepartmentProgramIds(programs, departmentId);

  // Filter programs and proposals by department
  const departmentProposals = programProposals.filter((proposal) =>
    departmentProgramIds.includes(proposal?.program?.id)
  );

  // Get pending proposals
  const pendingProposals = departmentProposals.filter(
    (proposal) => proposal?.status === "pending"
  );
  // Get for review proposals
  const forReviewProposals = departmentProposals.filter(
    (proposal) => proposal?.status === "review"
  );

  // Get revision proposals
  const revisionProposals = departmentProposals.filter(
    (proposal) => proposal?.status === "revision"
  );

  console.log(departmentProposals);
  const handleViewDetails = (id: number, type: "program" | "proposal") => {
    if (type === "program") {
      router.push(`/department/programs/${id}`);
    } else {
      router.push(`/department/proposals/${id}`);
      // router.push(`/department/proposals/${id}`);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/department/proposals/${id}/edit-proposal`);
  };

  // const handleReview = (id: number) => {
  //   router.push(`/department/proposals/${id}/review`);
  // };

  const isLoading = programsLoading || proposalsLoading;

  // Function to navigate to the new proposal page
  const navigateToNewProposal = () => {
    router.push("/department/proposals/new-program");
  };

  // Show the add button in the header only for the active tab IF that tab has content
  const showHeaderAddButton =
    (activeTab === "active" && activePrograms.length > 0) ||
    (activeTab === "pending" && pendingProposals.length > 0) ||
    (activeTab === "revision" && revisionProposals.length > 0);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold mb-6">Programs Dashboard</h3>
        {showHeaderAddButton && (
          <Button onClick={navigateToNewProposal}>
            <span>
              <Plus />
            </span>
            Add New Proposal
          </Button>
        )}
      </div>

      <Tabs
        defaultValue="active"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full md:grid-cols-4 mb-10">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending </TabsTrigger>
          <TabsTrigger value="review">For Review</TabsTrigger>
          <TabsTrigger value="revision">Revision</TabsTrigger>
        </TabsList>

        {/* Active */}
        <TabsContent value="active" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Active Programs
          </h2>

          {isLoading ? (
            <>
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
            </>
          ) : (
            <>
              {activePrograms.length > 0 ? (
                activePrograms.map((program) => (
                  <ProgramCard
                    key={`${program.id}`}
                    program={program}
                    status="active"
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <EmptyState
                  message="No active programs found"
                  onClick={navigateToNewProposal}
                />
              )}
            </>
          )}
        </TabsContent>
        {/* Pending */}
        <TabsContent value="pending" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Pending Program Proposals
          </h2>

          {isLoading ? (
            <>
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
            </>
          ) : (
            <>
              {pendingProposals.length > 0 ? (
                pendingProposals.map((proposal) => (
                  <ProgramCard
                    key={`proposal-${proposal.id}`}
                    programProposal={proposal}
                    status="pending"
                    onViewDetails={handleViewDetails}
                    // onReview={handleReview}
                  />
                ))
              ) : (
                <EmptyState
                  message="No pending program proposals found"
                  onClick={navigateToNewProposal}
                />
              )}
            </>
          )}
        </TabsContent>

        {/* For Review */}
        <TabsContent value="review" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-green-500" />
            For Review Programs
          </h2>

          {isLoading ? (
            <>
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
            </>
          ) : (
            <>
              {forReviewProposals.length > 0 ? (
                forReviewProposals.map((proposal) => (
                  <ProgramCard
                    key={`${proposal.id}`}
                    programProposal={proposal}
                    status="review"
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <EmptyState
                  message="No programs for review found"
                  onClick={navigateToNewProposal}
                />
              )}
            </>
          )}
        </TabsContent>
        {/* Revision */}
        <TabsContent value="revision" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-blue-500" />
            Programs Needing Revision
          </h2>

          {isLoading ? (
            <>
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
            </>
          ) : (
            <>
              {revisionProposals.length > 0 ? (
                revisionProposals.map((proposal) => (
                  <ProgramCard
                    key={`proposal-${proposal.id}`}
                    programProposal={proposal}
                    status="revision"
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <EmptyState
                  message="No program proposals need revision"
                  onClick={navigateToNewProposal}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({
  message,
  onClick,
}: {
  message: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-gray-50">
      <p className="text-gray-500 mb-4">{message}</p>
      <Button onClick={onClick}>Add New Program</Button>
    </div>
  );
}
