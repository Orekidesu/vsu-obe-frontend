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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Plus, Calculator } from "lucide-react";
import { AssessmentTaskRow } from "./TLAAssessmentTask";
import type {
  CourseOutcome,
  AssessmentTask,
} from "@/store/course/course-store";

interface CourseOutcomeTabProps {
  courseOutcome: CourseOutcome;
  assessmentTasks: AssessmentTask[];
  hasAtLeastOneAssessmentTask: boolean;
  totalWeight: number;
  assessmentTools: string[];
  onAddAssessmentTask: (courseOutcomeId: number) => void;
  onUpdateAssessmentTask: (
    id: string,
    courseOutcomeId: number,
    code: string,
    name: string,
    tool: string,
    weight: number
  ) => void;
  onRemoveAssessmentTask: (id: string) => void;
  handleAddCustomTool: (value: string) => string;
}

export function CourseOutcomeTab({
  courseOutcome,
  assessmentTasks,
  hasAtLeastOneAssessmentTask,
  totalWeight,
  assessmentTools,
  onAddAssessmentTask,
  onUpdateAssessmentTask,
  onRemoveAssessmentTask,
  handleAddCustomTool,
}: CourseOutcomeTabProps) {
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
              <h3 className="text-sm font-medium">Assessment Tasks</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {hasAtLeastOneAssessmentTask ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Tasks defined
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      No tasks defined
                    </span>
                  )}
                </span>
                <Badge variant="outline" className="flex items-center">
                  <Calculator className="h-3 w-3 mr-1" />
                  CO Weight: {totalWeight.toFixed(1)}%
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center"
                  onClick={() => onAddAssessmentTask(courseOutcome.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
              </div>
            </div>

            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] border">Task Code</TableHead>
                  <TableHead className="border">Task Name</TableHead>
                  <TableHead className="w-[200px] border">
                    Assessment Tool
                  </TableHead>
                  <TableHead className="w-[120px] border text-center">
                    Weight (%)
                  </TableHead>
                  <TableHead className="w-[80px] border"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessmentTasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No assessment tasks defined. Click &quot;Add Task&quot; to
                      create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  assessmentTasks.map((task) => (
                    <AssessmentTaskRow
                      key={task.id}
                      task={task}
                      courseOutcomeId={courseOutcome.id}
                      assessmentTools={assessmentTools}
                      onUpdateAssessmentTask={onUpdateAssessmentTask}
                      onRemoveAssessmentTask={onRemoveAssessmentTask}
                      handleAddCustomTool={handleAddCustomTool}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
