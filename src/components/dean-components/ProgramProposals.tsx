"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useProgramProposals from "@/hooks/department/useProgramProposal";
import { Loader2 } from "lucide-react";
import { ProposalFilterBar } from "./program-proposal-components/ProposalFilterBar";
import { ProposalCard } from "./program-proposal-components/ProposalCard";
import { EmptyProposalState } from "./program-proposal-components/EmptyProposalState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProgramProposalResponse } from "@/types/model/ProgramProposal";

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

type TabType = "pending" | "revision";

// Main Page Component
export default function ProgramProposals() {
  const router = useRouter();
  const { toast } = useToast();
  const { programProposals, isLoading, error, submitProposalReview } =
    useProgramProposals();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingApprovalProposal, setPendingApprovalProposal] =
    useState<ProgramProposalResponse | null>(null);

  // Filter proposals by status
  const pendingProposals =
    programProposals?.filter(
      (proposal) =>
        proposal.status.toLowerCase() === "review" &&
        proposal.has_revision_record === false
    ) || [];

  const revisionProposals =
    programProposals?.filter(
      (proposal) =>
        proposal.status.toLowerCase() === "review" &&
        proposal.has_revision_record === true
    ) || [];

  // Get active proposals list based on selected tab
  const activeProposals =
    activeTab === "pending" ? pendingProposals : revisionProposals;

  const handleApproveClick = (proposal: ProgramProposalResponse) => {
    setPendingApprovalProposal(proposal);
    setConfirmDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!pendingApprovalProposal) return;

    try {
      const proposalId = pendingApprovalProposal.id;

      const reviewData = {
        status: "approved",
      };

      submitProposalReview.mutate(
        {
          proposalId,
          reviewData,
        },
        {
          onSuccess: () => {
            // Show success toast
            toast({
              title: "Proposal Approved",
              description: `"${pendingApprovalProposal.program.name}" has been approved successfully.`,
              variant: "success",
            });

            // Close dialog and reset state
            setConfirmDialogOpen(false);
            setPendingApprovalProposal(null);
          },
          onError: (error) => {
            console.error("Failed to submit review:", error);

            // Show error toast
            toast({
              title: "Error",
              description: "Failed to approve the proposal. Please try again.",
              variant: "destructive",
            });

            // Close dialog but don't reset proposal in case they want to try again
            setConfirmDialogOpen(false);
          },
        }
      );
    } catch (error) {
      console.error("Error processing approval:", error);

      // Show error toast
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while processing your request.",
        variant: "destructive",
      });

      setConfirmDialogOpen(false);
    }
  };

  const handleViewDetails = (proposal: ProgramProposalResponse) => {
    router.push(`/dean/proposals/all-programs/${proposal.id}`);
  };
  const handleViewRevisionDetails = (proposal: ProgramProposalResponse) => {
    router.push(`/dean/proposals/all-programs/${proposal.id}/revision`);
  };

  // Get unique departments for filtering
  const departments = Array.from(
    new Set(
      activeProposals
        .map((proposal) => proposal.program.department_abbreviation)
        .filter(Boolean)
    )
  ).sort();

  // Filter proposals based on search term and selected department
  const filteredProposals = activeProposals.filter((proposal) => {
    // First filter by search term
    const matchesSearch =
      proposal.program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proposal.proposed_by &&
        `${proposal.proposed_by.first_name} ${proposal.proposed_by.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    // Then filter by department if not "all"
    const matchesDepartment =
      selectedDepartment === "all" ||
      proposal.program.department_abbreviation === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <p className="text-gray-500">Loading program proposals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">Error loading proposals</p>
          <p className="text-gray-500 mt-2">
            {error.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-xl font-bold mb-6">All Proposals</h1>

        <Tabs
          defaultValue="pending"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as TabType);
            setSelectedDepartment("all");
            setSearchTerm("");
          }}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              Pending
              <Badge variant="outline">{pendingProposals.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="revision" className="flex items-center gap-2">
              Revision
              <Badge variant="outline">{revisionProposals.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-0">
            <ProposalFilterBar
              proposalCount={filteredProposals.length}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
              departments={departments}
              title="Pending Proposals"
            />

            {filteredProposals.length > 0 ? (
              <div className="grid gap-4">
                {filteredProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={{
                      id: proposal.id.toString(),
                      name: proposal.program.name,
                      date: new Date(proposal.updated_at).toLocaleDateString(),
                      proposedBy: proposal.proposed_by
                        ? `${proposal.proposed_by.first_name} ${proposal.proposed_by.last_name}`
                        : "Unknown",
                      proposedDate: new Date(
                        proposal.created_at
                      ).toLocaleDateString(),
                      department: proposal.program.department_abbreviation,
                      status: proposal.status.toLowerCase(),
                    }}
                    onApprove={() => handleApproveClick(proposal)}
                    onViewDetails={() => handleViewDetails(proposal)}
                    status="pending"
                  />
                ))}
              </div>
            ) : (
              <EmptyProposalState
                hasFilters={searchTerm !== "" || selectedDepartment !== "all"}
                message={
                  searchTerm !== "" || selectedDepartment !== "all"
                    ? "No pending proposals match your filters"
                    : "No pending program proposals found"
                }
              />
            )}
          </TabsContent>

          <TabsContent value="revision" className="mt-0">
            <ProposalFilterBar
              proposalCount={filteredProposals.length}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
              departments={departments}
              title="Revision Proposals"
            />

            {filteredProposals.length > 0 ? (
              <div className="grid gap-4">
                {filteredProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={{
                      id: proposal.id.toString(),
                      name: proposal.program.name,
                      date: new Date(proposal.updated_at).toLocaleDateString(),
                      proposedBy: proposal.proposed_by
                        ? `${proposal.proposed_by.first_name} ${proposal.proposed_by.last_name}`
                        : "Unknown",
                      proposedDate: new Date(
                        proposal.created_at
                      ).toLocaleDateString(),
                      department: proposal.program.department_abbreviation,
                      status: proposal.status.toLowerCase(),
                    }}
                    onApprove={() => handleApproveClick(proposal)}
                    onViewDetails={() => handleViewRevisionDetails(proposal)}
                    status="review"
                  />
                ))}
              </div>
            ) : (
              <EmptyProposalState
                hasFilters={searchTerm !== "" || selectedDepartment !== "all"}
                message={
                  searchTerm !== "" || selectedDepartment !== "all"
                    ? "No revision proposals match your filters"
                    : "No revision program proposals found"
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve &quot;
              {pendingApprovalProposal?.program.name}&quot;? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveConfirm}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
