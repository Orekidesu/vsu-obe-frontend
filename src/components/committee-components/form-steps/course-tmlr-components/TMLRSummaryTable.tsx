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
  TeachingMethod,
  LearningResource,
} from "@/store/course/course-store";

interface SummaryTableProps {
  courseOutcomes: CourseOutcome[];
  teachingMethods: TeachingMethod[];
  learningResources: LearningResource[];
  getCOTeachingMethods: (courseOutcomeId: number) => string[];
  getCOLearningResources: (courseOutcomeId: number) => string[];
  hasAtLeastOneTeachingMethod: (courseOutcomeId: number) => boolean;
  hasAtLeastOneLearningResource: (courseOutcomeId: number) => boolean;
}

export function SummaryTable({
  courseOutcomes,
  teachingMethods,
  learningResources,
  getCOTeachingMethods,
  getCOLearningResources,
  hasAtLeastOneTeachingMethod,
  hasAtLeastOneLearningResource,
}: SummaryTableProps) {
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
              {courseOutcomes.map((co) => {
                const selectedMethods = getCOTeachingMethods(co.id);
                const selectedResources = getCOLearningResources(co.id);
                const hasMethods = hasAtLeastOneTeachingMethod(co.id);
                const hasResources = hasAtLeastOneLearningResource(co.id);
                const isValid = hasMethods && hasResources;

                // Get the names of selected methods and resources
                const methodNames = selectedMethods
                  .map(
                    (id) => teachingMethods.find((m) => m.id === id)?.name || ""
                  )
                  .filter(Boolean);

                const resourceNames = selectedResources
                  .map(
                    (id) =>
                      learningResources.find((r) => r.id === id)?.name || ""
                  )
                  .filter(Boolean);

                return (
                  <TableRow key={co.id}>
                    <TableCell className="border font-medium">
                      CO{co.id}
                    </TableCell>
                    <TableCell className="border">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{truncateText(co.statement)}</span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <p>{co.statement}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="border">
                      <div className="flex flex-wrap gap-1">
                        {methodNames.length > 0 ? (
                          methodNames.map((name, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {name}
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
                        {resourceNames.length > 0 ? (
                          resourceNames.map((name, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {name}
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
