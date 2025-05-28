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
import type { CourseOutcome } from "@/store/revision/course-revision-store";

interface TLAMethodSummaryTableProps {
  courseOutcomes: CourseOutcome[];
}

export function TLAMethodSummaryTable({
  courseOutcomes,
}: TLAMethodSummaryTableProps) {
  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number = 60) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teaching and Learning Summary</CardTitle>
        <CardDescription>
          Overview of teaching methods and learning resources across course
          outcomes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="border">CO</TableHead>
                <TableHead className="border">CO Statement</TableHead>
                <TableHead className="border">Teaching Methods</TableHead>
                <TableHead className="border">Learning Resources</TableHead>
                <TableHead className="border text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseOutcomes.map((outcome, index) => {
                const teachingMethods =
                  outcome.tla_assessment_method?.teaching_methods || [];
                const learningResources =
                  outcome.tla_assessment_method?.learning_resources || [];
                const hasMethods = teachingMethods.length > 0;
                const hasResources = learningResources.length > 0;
                const isValid = hasMethods && hasResources;

                return (
                  <TableRow key={index}>
                    <TableCell className="border font-medium">
                      CO{index + 1}
                    </TableCell>
                    <TableCell className="border">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{truncateText(outcome.statement)}</span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <p>{outcome.statement}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="border">
                      <div className="flex flex-wrap gap-1">
                        {teachingMethods.length > 0 ? (
                          teachingMethods.map((method, methodIndex) => (
                            <Badge
                              key={methodIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              {method}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            None selected
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="border">
                      <div className="flex flex-wrap gap-1">
                        {learningResources.length > 0 ? (
                          learningResources.map((resource, resourceIndex) => (
                            <Badge
                              key={resourceIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              {resource}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            None selected
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="border text-center">
                      {isValid ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Complete
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          Incomplete
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
