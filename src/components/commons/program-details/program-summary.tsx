import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ChevronLeft } from "lucide-react";

interface ProgramSummaryProps {
  programName: string;
  programAbbreviation: string;
  curriculumName: string;
  totalCourses: number;
  status?: string;
  showFullProposal?: boolean;
  onToggleView?: (showFull: boolean) => void;
}

export function ProgramSummary({
  programName,
  programAbbreviation,
  curriculumName,
  totalCourses,
  status,
  showFullProposal = false,
  onToggleView,
}: ProgramSummaryProps) {
  const getBadgeColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "review":
        return "bg-orange-100 text-orange-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "revision":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to format the status for display
  const getFormattedStatus = (status?: string) => {
    if (!status) return "";

    // Check if status is "review" and display as "Under Review"
    if (status.toLowerCase() === "review") {
      return "Under Review";
    }

    // For other statuses, capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const isRevision = status?.toLowerCase() === "revision";

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center flex-wrap gap-2 justify-between">
          <div className="flex items-center gap-2">
            <span>{programName}</span>
            <span>({programAbbreviation})</span>
            {status && (
              <Badge className={`${getBadgeColor(status)}`}>
                {getFormattedStatus(status)}
              </Badge>
            )}
          </div>

          {isRevision && (
            <Button
              variant={showFullProposal ? "secondary" : "outline"}
              size="sm"
              className={`px-3 py-1.5 h-auto text-sm font-medium transition-all ${
                showFullProposal
                  ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  : "border-primary text-primary hover:bg-primary/10"
              }`}
              onClick={() => onToggleView?.(!showFullProposal)}
            >
              <span className="flex items-center gap-1.5">
                {showFullProposal ? (
                  <>
                    <ChevronLeft className="h-4 w-4" />
                    <span>See Revisions</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>See Full Proposal</span>
                  </>
                )}
              </span>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Program Name</h3>
            <p className="text-lg">{programName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Abbreviation</h3>
            <p className="text-lg">{programAbbreviation}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Curriculum Name
            </h3>
            <p className="text-lg">{curriculumName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
            <p className="text-lg">{totalCourses}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
