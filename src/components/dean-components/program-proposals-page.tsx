"use client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import ProgramProposals, {
  type ProgramProposal as UIProposalType,
} from "@/components/dean-components/program-proposal/program-proposals";
import useProgramProposals from "@/hooks/department/useProgramProposal";
import { Loader2 } from "lucide-react";

export default function ProgramProposalsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { programProposals, isLoading, error, updateProgramProposal } =
    useProgramProposals();

  // Map API data structure to component's expected format
  const formattedProposals: UIProposalType[] =
    programProposals?.map((proposal) => ({
      id: proposal.id.toString(),
      name: proposal.program.name,
      date: new Date(proposal.updated_at).toLocaleDateString(),
      proposedBy: proposal.proposed_by
        ? `${proposal.proposed_by.first_name} ${proposal.proposed_by.last_name}`
        : "Unknown",
      proposedDate: new Date(proposal.created_at).toLocaleDateString(),
      department: proposal.program.department_abbreviation,
    })) || [];

  const handleApprove = async (proposal: UIProposalType) => {
    try {
      await updateProgramProposal.mutateAsync({
        id: parseInt(proposal.id),
        updatedData: { status: "approved" },
      });

      toast({
        title: "Proposal Approved",
        description: `"${proposal.name}" has been approved successfully.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to approve the proposal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (proposal: UIProposalType) => {
    router.push(`/dean/proposals/details/${proposal.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <p className="text-gray-500">Loading program proposals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <ProgramProposals
        proposals={formattedProposals}
        onApprove={handleApprove}
        onViewDetails={handleViewDetails}
        name="Program Proposals"
      />
    </div>
  );
}
