import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, FileEdit, Search, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
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
import { Badge } from "@/components/ui/badge";
import { ProgramProposalResponse } from "@/types/model/ProgramProposal";
import useApi from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect } from "react";

export default function ProgramTabs() {
  const { programs = [], isLoading: programsLoading } = usePrograms();
  const { programProposals = [], isLoading: proposalsLoading } =
    useProgramProposals();
  const { session } = useAuth() as { session: Session | null };
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");
  const [submittingProposalId, setSubmittingProposalId] = useState<
    number | null
  >(null);

  const api = useApi();
  const queryClient = useQueryClient();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasSavedForm, setHasSavedForm] = useState(false);

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
    (proposal) =>
      proposal?.status === "pending" ||
      (proposal?.status === "revision" &&
        proposal?.department_revision_required === false)
  );
  // Get for review proposals
  const forReviewProposals = departmentProposals.filter(
    (proposal) => proposal?.status === "review"
  );

  // Get revision proposals
  const revisionProposals = departmentProposals.filter(
    (proposal) =>
      proposal?.status === "revision" &&
      proposal?.department_revision_required === true
  );

  // console.log(departmentProposals);
  // Calculate course statistics for a proposal
  const calculateCourseStats = (proposal: ProgramProposalResponse) => {
    // Initialize counters
    let completed = 0;
    let needsRevision = 0;
    let total = 0;

    // Loop through all committees to find their assigned courses
    proposal.committees.forEach((committee) => {
      committee.assigned_courses.forEach((course) => {
        total++;
        if (course.is_completed) {
          completed++;
        } else if (course.is_in_revision) {
          needsRevision++;
        }
      });
    });

    // Calculate pending (not completed and not in revision)
    const pending = total - completed - needsRevision;

    return {
      completed,
      pending,
      needsRevision,
      total,
    };
  };
  // Check if there's a saved form in localStorage
  useEffect(() => {
    const savedForm = localStorage.getItem("program-wizard-storage");
    setHasSavedForm(!!savedForm);
  }, []);

  // Function to navigate to the new proposal page
  const navigateToNewProposal = () => {
    if (hasSavedForm) {
      setShowConfirmDialog(true);
    } else {
      router.push("/department/proposals/new-program");
    }
  };

  // Function to continue previous form
  const continuePreviousForm = () => {
    router.push("/department/proposals/new-program");
  };

  // Function to start fresh after confirmation
  const startFreshProposal = () => {
    localStorage.removeItem("program-wizard-storage");
    router.push("/department/proposals/new-program");
  };

  // Show the add button in the header only for the active tab IF that tab has content
  const showHeaderAddButton =
    (activeTab === "active" && activePrograms.length > 0) ||
    (activeTab === "pending" && pendingProposals.length > 0) ||
    (activeTab === "revision" && revisionProposals.length > 0);

  // Handle submission for review
  const handleSubmitForReview = async (proposalId: number) => {
    try {
      setSubmittingProposalId(proposalId); // Set the ID of the proposal being submitted

      await api.patch<{ data: ProgramProposalResponse }>(
        `department/program-proposals/${proposalId}/check-ready-for-review`
      );

      // Show success toast
      toast({
        title: "Success",
        description: "Program has been submitted for review successfully.",
        variant: "success",
      });
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ["program-proposals"] });
      queryClient.invalidateQueries({
        queryKey: ["program-proposal", proposalId],
      });

      // Optionally refresh data or redirect
    } catch (error) {
      console.error("Error submitting for review:", error);
      toast({
        title: "Submission Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit program for review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingProposalId(null); // Reset the submitting state
    }
  };

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

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold mb-6">Programs Dashboard</h3>
        <div className="flex gap-2">
          {hasSavedForm && (
            <Button
              onClick={continuePreviousForm}
              variant="outline"
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              Continue Draft
            </Button>
          )}
          {showHeaderAddButton && (
            <Button onClick={navigateToNewProposal}>
              <span>
                <Plus />
              </span>
              Add New Proposal
            </Button>
          )}
        </div>
      </div>

      <Tabs
        defaultValue="active"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full md:grid-cols-4 mb-10">
          <TabsTrigger className="flex items-center gap-2" value="active">
            Active
            <Badge variant="outline">{activePrograms.length}</Badge>
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="pending">
            Pending
            <Badge variant="outline">{pendingProposals.length}</Badge>
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="review">
            For Review
            <Badge variant="outline">{forReviewProposals.length}</Badge>
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="revision">
            Revision
            <Badge variant="outline">{revisionProposals.length}</Badge>
          </TabsTrigger>
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
                    courseStats={calculateCourseStats(proposal)}
                    onSubmitForReview={handleSubmitForReview}
                    isSubmitting={submittingProposalId === proposal.id}
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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              You have an unsaved program proposal draft. Starting a new
              proposal will discard your previous work.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={startFreshProposal}
              className="bg-red-600 hover:bg-red-700"
            >
              Discard Draft & Start New
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
  const [hasSavedForm, setHasSavedForm] = useState(false);

  const router = useRouter();
  // Check if there's a saved form
  useEffect(() => {
    const savedForm = localStorage.getItem("program-wizard-storage");
    setHasSavedForm(!!savedForm);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-gray-50">
      <p className="text-gray-500 mb-4">{message}</p>
      <div className="flex gap-3">
        {hasSavedForm && (
          <Button
            onClick={() => router.push("/department/proposals/new-program")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Continue Draft
          </Button>
        )}
        <Button onClick={onClick}>Add New Program</Button>
      </div>
    </div>
  );
}
