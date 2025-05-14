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

type Program = {
  id: string;
  name: string;
  date: string;
};

type ProgramProposal = Program & {
  proposedBy: string;
  proposedDate: string;
  department?: string;
  status: string;
};

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

  // Map API data structure to component's expected format
  const formattedProposals: ProgramProposal[] =
    programProposals?.map((proposal) => ({
      id: proposal.id.toString(),
      name: proposal.program.name,
      date: new Date(proposal.updated_at).toLocaleDateString(),
      proposedBy: proposal.proposed_by
        ? `${proposal.proposed_by.first_name} ${proposal.proposed_by.last_name}`
        : "Unknown",
      proposedDate: new Date(proposal.created_at).toLocaleDateString(),
      department: proposal.program.department_abbreviation,
      status: proposal.status.toLowerCase(),
    })) || [];

  // Filter proposals by status
  const pendingProposals = formattedProposals.filter(
    (proposal) => proposal.status === "review"
  );

  const revisionProposals = formattedProposals.filter(
    (proposal) => proposal.status === "revision"
  );

  // Get active proposals list based on selected tab
  const activeProposals =
    activeTab === "pending" ? pendingProposals : revisionProposals;

  const handleApprove = async (proposal: ProgramProposal) => {
    const proposalId = parseInt(proposal.id);

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
          // Update UI state

          // Show success toast
          toast({
            title: "Proposal Approved",
            description: `"${proposal.name}" has been approved successfully.`,
            variant: "success",
          });
        },
        onError: (error) => {
          console.error("Failed to submit review:", error);

          // Show error toast
          toast({
            title: "Error",
            description: "Failed to approve the proposal. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleViewDetails = (proposal: ProgramProposal) => {
    router.push(`/dean/proposals/all-programs/${proposal.id}`);
  };

  // Get unique departments for filtering
  const departments = Array.from(
    new Set(
      activeProposals
        .map((proposal) => proposal.department)
        .filter(Boolean) as string[]
    )
  ).sort();

  // Filter proposals based on search term and selected department
  const filteredProposals = activeProposals.filter((proposal) => {
    // First filter by search term
    const matchesSearch =
      proposal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.proposedBy.toLowerCase().includes(searchTerm.toLowerCase());

    // Then filter by department if not "all"
    const matchesDepartment =
      selectedDepartment === "all" ||
      proposal.department === selectedDepartment;

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
                    proposal={proposal}
                    onApprove={handleApprove}
                    onViewDetails={handleViewDetails}
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
                    proposal={proposal}
                    onApprove={handleApprove}
                    onViewDetails={handleViewDetails}
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
    </div>
  );
}
