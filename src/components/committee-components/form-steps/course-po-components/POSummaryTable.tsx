import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  CourseOutcome,
  ProgramOutcome,
} from "@/store/course/course-store";

interface POSummaryTableProps {
  courseOutcomes: CourseOutcome[];
  programOutcomes: ProgramOutcome[];
  getContributionLevel: (
    courseOutcomeId: number,
    programOutcomeId: number
  ) => "I" | "E" | "D" | null;
}

export function POSummaryTable({
  courseOutcomes,
  programOutcomes,
  getContributionLevel,
}: POSummaryTableProps) {
  // Get the color for a contribution level badge
  const getLevelBadgeColor = (level: "I" | "E" | "D") => {
    switch (level) {
      case "I":
        return "bg-blue-100 text-blue-800";
      case "E":
        return "bg-green-100 text-green-800";
      case "D":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CO-PO Mapping Summary</CardTitle>
        <CardDescription>
          Overview of all Course Outcomes mapped to Program Outcomes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="border">CO</TableHead>
                {programOutcomes.map((po) => (
                  <TableHead key={po.id} className="border text-center">
                    PO{po.id}
                    <div className="text-xs font-normal mt-1">
                      {po.availableContributionLevels?.join(", ") || "I, E, D"}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseOutcomes.map((co) => (
                <TableRow key={co.id}>
                  <TableCell className="border font-medium">
                    CO{co.id}
                  </TableCell>
                  {programOutcomes.map((po) => {
                    const level = getContributionLevel(co.id, po.id);
                    return (
                      <TableCell key={po.id} className="border text-center">
                        {level ? (
                          <Badge className={getLevelBadgeColor(level)}>
                            {level}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
