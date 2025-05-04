import { TabsContent } from "@/components/ui/tabs";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { POContributionRadioGroup } from "./POContributionRadioGroup";
import type {
  CourseOutcome,
  ProgramOutcome,
} from "@/store/course/course-store";

interface CourseOutcomeTabContentProps {
  courseOutcome: CourseOutcome;
  programOutcomes: ProgramOutcome[];
  activeTab: string;
  getContributionLevel: (
    courseOutcomeId: number,
    programOutcomeId: number
  ) => "I" | "E" | "D" | null;
  hasAtLeastOnePOMapping: (courseOutcomeId: number) => boolean;
  onUpdatePO: (
    courseOutcomeId: number,
    programOutcomeId: number,
    contributionLevel: "I" | "E" | "D" | null
  ) => void;
}

export function CourseOutcomeTabContent({
  courseOutcome,
  programOutcomes,
  // activeTab,
  getContributionLevel,
  hasAtLeastOnePOMapping,
  onUpdatePO,
}: CourseOutcomeTabContentProps) {
  // Truncate long text for display
  const truncateText = (text: string, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <TabsContent value={courseOutcome.id.toString()} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Course Outcome {courseOutcome.id}
          </CardTitle>
          <CardDescription>{courseOutcome.statement}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Map to Program Outcomes</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {hasAtLeastOnePOMapping(courseOutcome.id) ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Mapped
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Not mapped
                    </span>
                  )}
                </span>
              </div>
            </div>

            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] border">PO</TableHead>
                  <TableHead className="border">Statement</TableHead>
                  <TableHead className="w-[250px] border text-center">
                    Contribution Level
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programOutcomes.map((po) => {
                  const contributionLevel = getContributionLevel(
                    courseOutcome.id,
                    po.id
                  );

                  return (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium border">
                        PO{po.id}
                      </TableCell>
                      <TableCell className="border">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{truncateText(po.statement)}</span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-md">
                              <p>{po.statement}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="border">
                        <POContributionRadioGroup
                          courseOutcome={courseOutcome}
                          programOutcome={po}
                          contributionLevel={contributionLevel}
                          onUpdatePO={onUpdatePO}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
