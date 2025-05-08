import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface ProgramSummaryProps {
  programName: string;
  programAbbreviation: string;
  curriculumName: string;
  totalCourses: number;
  status?: string; //
}

export function ProgramSummary({
  programName,
  programAbbreviation,
  curriculumName,
  totalCourses,
  status,
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

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">
          {/* {programName} ({programAbbreviation})
           */}
          <span>
            {programName} ({programAbbreviation})
          </span>
          {status && (
            <Badge className={`ml-2 ${getBadgeColor(status)}`}>
              {getFormattedStatus(status)}
            </Badge>
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
