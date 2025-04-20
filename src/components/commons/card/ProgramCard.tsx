import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { Program } from "@/types/model/Program";
import { ProgramProposal } from "@/types/model/ProgramProposal";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

// Define types for the props
export interface ProgramCardProps {
  program?: Program;
  programProposal?: ProgramProposal;
  status: "active" | "pending" | "revision";
  onViewDetails?: (id: number, type: "program" | "proposal") => void;
  onEdit?: (id: number) => void;
  onReview?: (id: number) => void;
}

export function StatusBadge({
  status,
}: {
  status: "active" | "pending" | "revision";
}) {
  if (status === "active") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3 w-3 mr-1" /> Active
      </Badge>
    );
  }

  if (status === "pending") {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        <Clock className="h-3 w-3 mr-1" /> Pending
      </Badge>
    );
  }

  return (
    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
      <AlertCircle className="h-3 w-3 mr-1" /> Needs Revision
    </Badge>
  );
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  programProposal,
  status,
  onViewDetails,
  onEdit,
  // onReview,
}) => {
  // Handle both program and programProposal based on status
  const isActiveProgram = status === "active" && program;
  const isProposal =
    (status === "pending" || status === "revision") && programProposal;

  if (!isActiveProgram && !isProposal) {
    console.error(
      "ProgramCard requires either program (for active) or programProposal (for pending/revision)"
    );
    return null;
  }

  // Extract data based on whether it's a program or proposal
  const data = isActiveProgram ? program : programProposal;
  const id = data?.id || 0;
  const title = isActiveProgram ? program?.name : programProposal?.program.name;
  const abbreviation = isActiveProgram
    ? program?.abbreviation
    : programProposal?.abbreviation;
  const version = isActiveProgram ? program?.version : programProposal?.version;

  // Format date based on data source
  const dateField = isActiveProgram
    ? program?.updated_at
    : programProposal?.created_at;
  const dateLabel = isActiveProgram ? "Approved Date" : "Proposed Date";
  const formattedDate = dateField
    ? moment(dateField).format("MMM DD, YYYY")
    : "";

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(id, isActiveProgram ? "program" : "proposal");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{title}</CardTitle>
          <StatusBadge status={status} />
        </div>
        <CardDescription>
          {abbreviation} {version && `Version ${version}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formattedDate && (
          <p className="text-sm text-gray-500 mb-2">
            {dateLabel}: {formattedDate}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleViewDetails}>
          View Details
        </Button>

        {status === "revision" && (
          <Button onClick={() => onEdit && onEdit(id)}>Edit Program</Button>
        )}

        {/* {status === "pending" && (
          <Button onClick={() => onReview && onReview(id)}>Review</Button>
        )} */}
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
