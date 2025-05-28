import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCourseRevisionStore } from "./store-provider/CourseRevisionStoreProvider";

import {
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  RotateCcw,
  Calculator,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TLASummaryTable } from "./tla-task-components/TLASummary";

// Assessment tool options
const defaultAssessmentTools = ["Marking Scheme", "Rubric", "Project"];

interface TLATask {
  id?: number;
  at_code: string;
  at_name: string;
  at_tool: string;
  weight: string;
}

interface TLATasksRevisionProps {
  onValidityChange?: (isValid: boolean) => void;
}

export function TLATasksRevision({ onValidityChange }: TLATasksRevisionProps) {
  const store = useCourseRevisionStore();
  const {
    courseOutcomes,
    updateCourseOutcome,
    resetTLATasks,
    modifiedSections,
    markSectionAsModified,
  } = store();
  const [selectedCOIndex, setSelectedCOIndex] = useState(0);
  const [customTools, setCustomTools] = useState<string[]>([]);
  const [isAddingCustomTool, setIsAddingCustomTool] = useState<{
    [key: string]: boolean;
  }>({});
  const [customToolInput, setCustomToolInput] = useState<{
    [key: string]: string;
  }>({});

  // Check if this section has been modified
  const isModified = modifiedSections.has("tla_tasks");

  // Get all available assessment tools (default + custom)
  const getAllAssessmentTools = () => {
    return [...defaultAssessmentTools, ...customTools];
  };

  // Calculate total weight across all course outcomes
  const calculateTotalWeight = useCallback(() => {
    return courseOutcomes.reduce((total, outcome) => {
      const outcomeWeight = outcome.tla_tasks.reduce((sum, task) => {
        return sum + (Number.parseFloat(task.weight) || 0);
      }, 0);
      return total + outcomeWeight;
    }, 0);
  }, [courseOutcomes]);

  // Calculate weight for a specific course outcome
  const calculateCOWeight = (coIndex: number) => {
    const outcome = courseOutcomes[coIndex];
    if (!outcome) return 0;
    return outcome.tla_tasks.reduce((sum, task) => {
      return sum + (Number.parseFloat(task.weight) || 0);
    }, 0);
  };

  // Get status for a course outcome
  const getCOStatus = (coIndex: number) => {
    const outcome = courseOutcomes[coIndex];
    if (!outcome || outcome.tla_tasks.length === 0) {
      return {
        status: "warning",
        text: "No tasks defined",
        icon: AlertTriangle,
      };
    }
    const weight = calculateCOWeight(coIndex);
    if (weight > 0) {
      return { status: "success", text: "Tasks defined", icon: CheckCircle };
    }
    return { status: "warning", text: "No tasks defined", icon: AlertTriangle };
  };

  const everyCoHasTasks = useCallback(() => {
    return courseOutcomes.every((outcome) => outcome.tla_tasks.length > 0);
  }, [courseOutcomes]);

  // Validate TLA tasks
  const validateTLATasks = useCallback(() => {
    const totalWeight = calculateTotalWeight();
    const allCOsHaveTasks = everyCoHasTasks();

    // Validation rules:
    // 1. Total weight must be exactly 100%
    // 2. Each CO must have at least one assessment task
    return Math.abs(totalWeight - 100) < 0.01 && allCOsHaveTasks;
  }, [calculateTotalWeight, everyCoHasTasks]);

  // Update validity whenever relevant data changes
  useEffect(() => {
    if (onValidityChange) {
      const isValid = validateTLATasks();
      onValidityChange(isValid);
    }
  }, [onValidityChange, validateTLATasks]);

  // Add a new empty task row to the selected course outcome
  const handleAddTask = () => {
    const selectedOutcome = courseOutcomes[selectedCOIndex];
    if (!selectedOutcome) return;

    const newTask: TLATask = {
      id: Date.now(),
      at_code: "",
      at_name: "",
      at_tool: "",
      weight: "",
    };

    const updatedTasks = [...selectedOutcome.tla_tasks, newTask];

    updateCourseOutcome(selectedOutcome.id, {
      tla_tasks: updatedTasks,
    });
    markSectionAsModified("tla_tasks");
  };

  // Remove a task from the selected course outcome
  const handleRemoveTask = (taskIndex: number) => {
    const selectedOutcome = courseOutcomes[selectedCOIndex];
    if (!selectedOutcome) return;

    const updatedTasks = selectedOutcome.tla_tasks.filter(
      (_, index) => index !== taskIndex
    );

    updateCourseOutcome(selectedOutcome.id, {
      tla_tasks: updatedTasks,
    });
    markSectionAsModified("tla_tasks");
  };

  // Update a task in the selected course outcome
  const handleUpdateTask = (
    taskIndex: number,
    field: keyof TLATask,
    value: string
  ) => {
    const selectedOutcome = courseOutcomes[selectedCOIndex];
    if (!selectedOutcome) return;

    const updatedTasks = selectedOutcome.tla_tasks.map((task, index) =>
      index === taskIndex ? { ...task, [field]: value } : task
    );

    updateCourseOutcome(selectedOutcome.id, {
      tla_tasks: updatedTasks,
    });
    markSectionAsModified("tla_tasks");
  };

  // Handle custom tool addition
  const handleAddCustomTool = (taskIndex: number) => {
    const toolKey = `${selectedCOIndex}-${taskIndex}`;
    const customTool = customToolInput[toolKey]?.trim();

    if (customTool && !getAllAssessmentTools().includes(customTool)) {
      setCustomTools((prev) => [...prev, customTool]);
      handleUpdateTask(taskIndex, "at_tool", customTool);
    }

    setIsAddingCustomTool((prev) => ({ ...prev, [toolKey]: false }));
    setCustomToolInput((prev) => ({ ...prev, [toolKey]: "" }));
  };

  // Reset TLA tasks to original state
  const handleReset = () => {
    resetTLATasks();
    setCustomTools([]);
  };

  const totalWeight = calculateTotalWeight();

  return (
    <div className="space-y-6">
      {/* Header Alert */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">TLA Tasks</h2>
          {isModified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Modified
            </Badge>
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={!isModified}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Changes
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset TLA Tasks</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all Teaching, Learning, and Assessment tasks to
                their original state. Any changes you&apos;ve made will be lost.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Alert className="bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-600" />
        <strong>Teaching, Learning, and Assessment (TLA) Plan</strong>
        <AlertDescription className="text-amber-800">
          Define assessment tasks for each Course Outcome. Each CO must have at
          least one assessment task.
          <br />
          The total assessment weight across all tasks must equal exactly 100%.
        </AlertDescription>
        <div className="flex items-center  pt-1 gap-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
              <Calculator className="h-3 w-3 mr-1" />
              Total Weight: {totalWeight.toFixed(1)}%
            </Badge>
          </div>
          <div className="flex items-center ">
            {totalWeight === 100 ? (
              <Badge className="bg-green-500 text-white">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Weight is valid
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-600"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Total weight must be 100%
              </Badge>
            )}
          </div>
        </div>
      </Alert>

      {/* Weight Summary */}

      {/* Course Outcome Tabs */}
      <Tabs
        value={selectedCOIndex.toString()}
        onValueChange={(value) => setSelectedCOIndex(Number.parseInt(value))}
      >
        <TabsList className="grid w-full grid-cols-3">
          {courseOutcomes.map((outcome, index) => {
            const status = getCOStatus(index);
            const StatusIcon = status.icon;
            return (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className="flex items-center gap-2"
              >
                <StatusIcon
                  className={`h-4 w-4 ${status.status === "success" ? "text-green-500" : "text-amber-500"}`}
                />
                CO{index + 1}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {courseOutcomes.map((outcome, coIndex) => (
          <TabsContent key={coIndex} value={coIndex.toString()}>
            <Card>
              <CardHeader>
                <CardTitle>Course Outcome {coIndex + 1}</CardTitle>
                <p className="text-sm text-gray-600">{outcome.statement}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Assessment Tasks Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Assessment Tasks</h3>
                    <div className="flex items-center gap-4">
                      {outcome.tla_tasks.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">
                            Tasks defined
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span className="text-sm text-amber-600">
                            No tasks defined
                          </span>
                        </div>
                      )}
                      <Badge variant="outline" className="text-sm">
                        CO Weight: {calculateCOWeight(coIndex).toFixed(1)}%
                      </Badge>
                      <Button size="sm" onClick={handleAddTask}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  </div>

                  {/* Tasks Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task Code</TableHead>
                        <TableHead>Task Name</TableHead>
                        <TableHead>Assessment Tool</TableHead>
                        <TableHead>Weight (%)</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outcome.tla_tasks.map((task, taskIndex) => {
                        const toolKey = `${coIndex}-${taskIndex}`;
                        const isAddingTool = isAddingCustomTool[toolKey];

                        return (
                          <TableRow key={taskIndex}>
                            <TableCell>
                              <Input
                                value={task.at_code}
                                onChange={(e) =>
                                  handleUpdateTask(
                                    taskIndex,
                                    "at_code",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Q1"
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={task.at_name}
                                onChange={(e) =>
                                  handleUpdateTask(
                                    taskIndex,
                                    "at_name",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Quiz 1"
                              />
                            </TableCell>
                            <TableCell>
                              {isAddingTool ? (
                                <div className="flex gap-2">
                                  <Input
                                    value={customToolInput[toolKey] || ""}
                                    onChange={(e) =>
                                      setCustomToolInput((prev) => ({
                                        ...prev,
                                        [toolKey]: e.target.value,
                                      }))
                                    }
                                    placeholder="Enter custom tool name"
                                    className="flex-1"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleAddCustomTool(taskIndex);
                                      } else if (e.key === "Escape") {
                                        setIsAddingCustomTool((prev) => ({
                                          ...prev,
                                          [toolKey]: false,
                                        }));
                                        setCustomToolInput((prev) => ({
                                          ...prev,
                                          [toolKey]: "",
                                        }));
                                      }
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleAddCustomTool(taskIndex)
                                    }
                                  >
                                    Add
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setIsAddingCustomTool((prev) => ({
                                        ...prev,
                                        [toolKey]: false,
                                      }));
                                      setCustomToolInput((prev) => ({
                                        ...prev,
                                        [toolKey]: "",
                                      }));
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Select
                                  value={task.at_tool}
                                  onValueChange={(value) => {
                                    handleUpdateTask(
                                      taskIndex,
                                      "at_tool",
                                      value
                                    );
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select assessment tool" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAllAssessmentTools().map((tool) => (
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
                                            if (
                                              value &&
                                              !getAllAssessmentTools().includes(
                                                value
                                              )
                                            ) {
                                              setCustomTools((prev) => [
                                                ...prev,
                                                value,
                                              ]);
                                              handleUpdateTask(
                                                taskIndex,
                                                "at_tool",
                                                value
                                              );
                                              input.value = "";
                                            }
                                          }
                                        }}
                                      />
                                    </div>
                                  </SelectContent>
                                </Select>
                              )}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={task.weight}
                                onChange={(e) =>
                                  handleUpdateTask(
                                    taskIndex,
                                    "weight",
                                    e.target.value
                                  )
                                }
                                placeholder="0"
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveTask(taskIndex)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {outcome.tla_tasks.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-gray-500"
                          >
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p>
                              No assessment tasks defined. Click &quot;Add
                              Task&quot; to create one.
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* TLA Plan Summary */}

      <TLASummaryTable
        courseOutcomes={courseOutcomes}
        calculateCOWeight={calculateCOWeight}
        totalWeight={totalWeight}
        isTotalWeightValid={totalWeight === 100}
      />
    </div>
  );
}
