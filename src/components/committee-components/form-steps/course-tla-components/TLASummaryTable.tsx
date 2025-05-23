import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  CourseOutcome,
  AssessmentTask,
} from "@/store/course/course-store";

interface TLASummaryTableProps {
  courseOutcomes: CourseOutcome[];
  getAssessmentTasksForCO: (courseOutcomeId: number) => AssessmentTask[];
  getTotalWeightForCO: (courseOutcomeId: number) => number;
  totalWeight: number;
  isTotalWeightValid: boolean;
}

export function TLASummaryTable({
  courseOutcomes,
  getAssessmentTasksForCO,
  getTotalWeightForCO,
  totalWeight,
  isTotalWeightValid,
}: TLASummaryTableProps) {
  // Truncate text helper
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>TLA Plan Summary</CardTitle>
        <CardDescription>
          Overview of all assessment tasks across course outcomes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="border">CO</TableHead>
                <TableHead className="border">CO Statement</TableHead>
                <TableHead className="border">Assessment Tasks</TableHead>
                <TableHead className="border text-center">
                  Total Weight
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseOutcomes.map((co) => {
                const coTasks = getAssessmentTasksForCO(co.id);
                const coTotalWeight = getTotalWeightForCO(co.id);

                return (
                  <TableRow key={co.id}>
                    <TableCell className="border font-medium">
                      CO{co.id}
                    </TableCell>
                    <TableCell className="border">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{truncateText(co.statement, 60)}</span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <p>{co.statement}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="border">
                      <div className="flex flex-wrap gap-1">
                        {coTasks.map((task) => (
                          <TooltipProvider key={task.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-xs">
                                  {task.code || "—"}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-sm">
                                  <p className="font-semibold">
                                    {task.name || "Unnamed Task"}
                                  </p>
                                  <p>Tool: {task.tool}</p>
                                  <p>Weight: {task.weight}%</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                        {coTasks.length === 0 && (
                          <span className="text-muted-foreground text-xs">
                            No tasks
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="border text-center">
                      <Badge
                        className={
                          coTotalWeight > 0
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }
                      >
                        {coTotalWeight.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="border font-medium text-right"
                >
                  Total Assessment Weight:
                </TableCell>
                <TableCell className="border text-center">
                  <Badge
                    className={
                      isTotalWeightValid
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {totalWeight.toFixed(1)}%
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
