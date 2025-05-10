import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LightbulbIcon, Search, CheckCircle, FilterIcon } from "lucide-react";

type Program = {
  id: string;
  name: string;
  date: string;
};

export type ProgramProposal = Program & {
  proposedBy: string;
  proposedDate: string;
  department?: string;
  // Removed budget, targetAudience, expectedOutcomes, and comments
};

export type ProgramProposalsProps = {
  proposals: ProgramProposal[];
  name?: string;
  className?: string;
  onApprove?: (proposal: ProgramProposal) => void;
  onViewDetails?: (proposal: ProgramProposal) => void;
  // Removed onReject and onRequestChanges
};

export default function ProgramProposals({
  proposals,
  name = "Program Proposals",
  className = "",
  onApprove,
  onViewDetails,
}: ProgramProposalsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // Extract unique departments for the filter
  const departments = useMemo(() => {
    const deptSet = new Set<string>();

    proposals.forEach((proposal) => {
      if (proposal.department) {
        deptSet.add(proposal.department);
      }
    });

    return Array.from(deptSet).sort();
  }, [proposals]);

  // Filter proposals based on search term and selected department
  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
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
  }, [proposals, searchTerm, selectedDepartment]);

  return (
    <div className={`container mx-auto py-10 px-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <LightbulbIcon className="h-6 w-6 text-amber-500" />
          <h1 className="text-2xl font-bold">{name}</h1>
          <Badge variant="outline" className="ml-2">
            {proposals.length} Proposals
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search proposals..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <FilterIcon className="h-4 w-4" />
                  <SelectValue placeholder="Filter by department" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredProposals.length > 0 ? (
        <div className="grid gap-4">
          {filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onApprove={onApprove}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-gray-50">
          <LightbulbIcon className="h-12 w-12 text-gray-400 mb-4" />
          {searchTerm || selectedDepartment !== "all" ? (
            <p className="text-gray-500">No proposals match your filters</p>
          ) : (
            <p className="text-gray-500">No program proposals found</p>
          )}
        </div>
      )}
    </div>
  );
}

type ProposalCardProps = {
  proposal: ProgramProposal;
  onApprove?: (proposal: ProgramProposal) => void;
  onViewDetails?: (proposal: ProgramProposal) => void;
};

function ProposalCard({
  proposal,
  onApprove,
  onViewDetails,
}: ProposalCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{proposal.name}</CardTitle>
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            For Review
          </Badge>
        </div>
        <CardDescription>
          {/* Removed category, only showing proposer */}
          Proposed by {proposal.proposedBy}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Proposed on: {proposal.proposedDate}
          </p>
          {proposal.department && (
            <p className="text-sm text-gray-500">
              Department: {proposal.department}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(proposal)}
          >
            View Details
          </Button>
        )}
        {onApprove && (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onApprove(proposal)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
