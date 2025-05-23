"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, History } from "lucide-react";

type Proposal = {
  id: string;
  name: string;
  date: string;
  proposedBy: string;
  proposedDate: string;
  department?: string;
  status: string;
};

type ProposalCardProps = {
  proposal: Proposal;
  onApprove?: (proposal: Proposal) => void;
  onViewDetails?: (proposal: Proposal) => void;
  status?: string;
};

export function ProposalCard({
  proposal,
  onApprove,
  onViewDetails,
  status = "pending",
}: ProposalCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{proposal.name}</CardTitle>
          <Badge
            className={
              status === "pending"
                ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
            }
          >
            {status === "pending" ? "For Review" : "Revised"}
          </Badge>
        </div>
        <CardDescription>Proposed by {proposal.proposedBy}</CardDescription>
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
        {onApprove && status === "pending" && (
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={() => onApprove(proposal)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        )}
        {status === "review" && (
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={() => onViewDetails && onViewDetails(proposal)}
          >
            <History className="h-4 w-4 mr-2" />
            Approve Changes
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
