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
import { ProgramResponse } from "@/types/model/Program";
import { ProgramProposalResponse } from "@/types/model/ProgramProposal";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Check,
  Loader2,
} from "lucide-react";

// Define types for the props
export interface ProgramCardProps {
  program?: ProgramResponse;
  programProposal?: ProgramProposalResponse;
  status: "active" | "pending" | "revision" | "review";
  onViewDetails?: (id: number, type: "program" | "proposal") => void;
  onEdit?: (id: number) => void;
  onSubmitForReview?: (id: number) => void;
  isSubmitting?: boolean;
  courseStats?: {
    completed: number;
    pending: number;
    needsRevision: number;
    total: number;
  };
}

export function StatusBadge({
  status,
}: {
  status: "active" | "pending" | "revision" | "review";
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
  if (status === "review") {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        <Search className="h-3 w-3 mr-1" /> For Review
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
  onSubmitForReview,
  isSubmitting = false,
  courseStats,
  // onReview,
}) => {
  // Handle both program and programProposal based on status
  const isActiveProgram = status === "active" && program;
  const isProposal =
    (status === "pending" || status === "revision" || status === "review") &&
    programProposal;

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
    : programProposal?.program.abbreviation;
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
  const allCoursesCompleted =
    courseStats?.completed === courseStats?.total &&
    (courseStats?.total || 0) > 0;

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

        {/* Show course status for pending proposals */}
        {status === "pending" && courseStats && (
          <div className="mt-3 space-y-1">
            <h4 className="text-sm font-medium">Course Status:</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col items-center p-2 bg-green-50 rounded-md">
                <span className="font-medium text-green-700">
                  {courseStats.completed}
                </span>
                <span className="text-xs text-gray-600">Completed</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-amber-50 rounded-md">
                <span className="font-medium text-amber-700">
                  {courseStats.pending}
                </span>
                <span className="text-xs text-gray-600">Pending</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-red-50 rounded-md">
                <span className="font-medium text-red-700">
                  {courseStats.needsRevision}
                </span>
                <span className="text-xs text-gray-600">Needs Revision</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleViewDetails}>
          View Details
        </Button>

        {status === "revision" && (
          <Button onClick={() => onEdit && onEdit(id)}>Edit Program</Button>
        )}

        {/* Submit for Review button if all courses are completed */}
        {status === "pending" && allCoursesCompleted && onSubmitForReview && (
          <Button
            onClick={() => onSubmitForReview(id)}
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Submit for Review
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
