import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Info,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calculator,
} from "lucide-react";
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

interface CourseOutcomesTLAStepProps {
  courseOutcomes: CourseOutcome[];
  assessmentTasks: AssessmentTask[];
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
  getTotalAssessmentWeight: () => number;
}

export function CourseOutcomesTLAStep({
  courseOutcomes,
  assessmentTasks,
  onAddAssessmentTask,
  onUpdateAssessmentTask,
  onRemoveAssessmentTask,
  getTotalAssessmentWeight,
}: CourseOutcomesTLAStepProps) {
  const [activeTab, setActiveTab] = useState<string>(
    courseOutcomes[0]?.id.toString() || "1"
  );
  const [customTools, setCustomTools] = useState<string[]>([]);

  // Default assessment tools
  const defaultTools = ["Marking Scheme", "Rubric", "Project"];

  // Combine default and custom tools
  const assessmentTools = [
    ...defaultTools,
    ...customTools.filter((tool) => !defaultTools.includes(tool)),
  ];

  // Helper function to handle adding custom tools
  const handleAddCustomTool = (value: string) => {
    if (value && !assessmentTools.includes(value)) {
      setCustomTools([...customTools, value]);
      return value;
    }
    return value;
  };

  // Helper function to get assessment tasks for a specific CO
  const getAssessmentTasksForCO = (
    courseOutcomeId: number
  ): AssessmentTask[] => {
    return assessmentTasks.filter(
      (task) => task.courseOutcomeId === courseOutcomeId
    );
  };

  // Check if a CO has at least one assessment task
  const hasAtLeastOneAssessmentTask = (courseOutcomeId: number): boolean => {
    return assessmentTasks.some(
      (task) => task.courseOutcomeId === courseOutcomeId
    );
  };

  // Get the total weight for a specific CO
  const getTotalWeightForCO = (courseOutcomeId: number): number => {
    return getAssessmentTasksForCO(courseOutcomeId).reduce(
      (total, task) => total + task.weight,
      0
    );
  };

  // Get the total weight across all COs
  const totalWeight = getTotalAssessmentWeight();

  // Check if the total weight is exactly 100%
  const isTotalWeightValid = Math.abs(totalWeight - 100) < 0.01; // Allow for small floating point errors

  return (
    <div className="space-y-6">
      {/* Instructions and Legend */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-blue-800">
              Teaching, Learning, and Assessment (TLA) Plan
            </h3>
            <p className="text-sm text-blue-700">
              Define assessment tasks for each Course Outcome. Each CO must have
              at least one assessment task.
            </p>
            <p className="text-sm text-blue-700">
              The total assessment weight across all tasks must equal exactly
              100%.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Calculator className="h-3 w-3 mr-1" />
                  Total Weight: {totalWeight.toFixed(1)}%
                </Badge>
              </div>
              {isTotalWeightValid ? (
                <span className="text-xs text-green-600 flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Weight is valid
                </span>
              ) : (
                <span className="text-xs text-amber-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Total weight must be 100%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Course Outcomes */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-4">
          {courseOutcomes.map((co) => (
            <TabsTrigger
              key={co.id}
              value={co.id.toString()}
              className="relative"
            >
              CO{co.id}
              {hasAtLeastOneAssessmentTask(co.id) ? (
                <CheckCircle2 className="h-3 w-3 text-green-500 absolute -top-1 -right-1" />
              ) : (
                <AlertCircle className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {courseOutcomes.map((co) => {
          const coTasks = getAssessmentTasksForCO(co.id);
          const coTotalWeight = getTotalWeightForCO(co.id);

          return (
            <TabsContent
              key={co.id}
              value={co.id.toString()}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Course Outcome {co.id}
                  </CardTitle>
                  <CardDescription>{co.statement}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Assessment Tasks</h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">
                          {hasAtLeastOneAssessmentTask(co.id) ? (
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
                          CO Weight: {coTotalWeight.toFixed(1)}%
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                          onClick={() => onAddAssessmentTask(co.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Task
                        </Button>
                      </div>
                    </div>

                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] border">
                            Task Code
                          </TableHead>
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
                        {coTasks.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-4 text-muted-foreground"
                            >
                              No assessment tasks defined. Click &quot;Add
                              Task&quot; to create one.
                            </TableCell>
                          </TableRow>
                        ) : (
                          coTasks.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell className="border">
                                <Input
                                  value={task.code}
                                  onChange={(e) =>
                                    onUpdateAssessmentTask(
                                      task.id,
                                      co.id,
                                      e.target.value,
                                      task.name,
                                      task.tool,
                                      task.weight
                                    )
                                  }
                                  className="h-8"
                                  placeholder="e.g., Q1"
                                />
                              </TableCell>
                              <TableCell className="border">
                                <Input
                                  value={task.name}
                                  onChange={(e) =>
                                    onUpdateAssessmentTask(
                                      task.id,
                                      co.id,
                                      task.code,
                                      e.target.value,
                                      task.tool,
                                      task.weight
                                    )
                                  }
                                  className="h-8"
                                  placeholder="e.g., Quiz 1"
                                />
                              </TableCell>
                              <TableCell className="border">
                                <div className="flex space-x-2">
                                  <Select
                                    value={task.tool}
                                    onValueChange={(value) =>
                                      onUpdateAssessmentTask(
                                        task.id,
                                        co.id,
                                        task.code,
                                        task.name,
                                        value,
                                        task.weight
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Select a tool" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {assessmentTools.map((tool) => (
                                        <SelectItem key={tool} value={tool}>
                                          {tool}
                                        </SelectItem>
                                      ))}
                                      <div className="p-2 border-t">
                                        <Input
                                          placeholder="Add custom tool..."
                                          className="h-8"
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault();
                                              const input = e.currentTarget;
                                              const value = input.value.trim();
                                              if (value) {
                                                const newTool =
                                                  handleAddCustomTool(value);
                                                onUpdateAssessmentTask(
                                                  task.id,
                                                  co.id,
                                                  task.code,
                                                  task.name,
                                                  newTool,
                                                  task.weight
                                                );
                                                input.value = "";
                                              }
                                            }
                                          }}
                                        />
                                      </div>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                              <TableCell className="border">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  value={task.weight}
                                  onChange={(e) =>
                                    onUpdateAssessmentTask(
                                      task.id,
                                      co.id,
                                      task.code,
                                      task.name,
                                      task.tool,
                                      Number.parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="h-8 text-center"
                                  placeholder="0.0"
                                />
                              </TableCell>
                              <TableCell className="border text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    onRemoveAssessmentTask(task.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Summary Table */}
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
                              <span>
                                {co.statement.length > 60
                                  ? co.statement.substring(0, 60) + "..."
                                  : co.statement}
                              </span>
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
    </div>
  );
}
