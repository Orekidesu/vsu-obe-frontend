"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCourseRevisionStore } from "@/store/revision/course-revision-store";
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Info,
  RotateCcw,
  BookOpen,
  Users,
} from "lucide-react";

// Default teaching methods
const defaultTeachingMethods = [
  "Lecture",
  "Demonstration",
  "Problem-Based Learning",
  "Role Play",
  "Project",
  "Field Trip",
  "Peer Teaching",
  "Discussion",
  "Group Work",
  "Case Study",
  "Simulation",
  "Laboratory",
  "Flipped Classroom",
  "Experiments",
];

// Default learning resources
const defaultLearningResources = [
  "Textbooks",
  "Lecture Notes",
  "Videos",
  "Journal Articles",
  "Websites",
  "Reference Books",
  "PPT Slides",
  "Online Tutorials",
  "Software",
  "Lab Manuals",
];

export function TLAMethodsRevision() {
  const { courseOutcomes, updateCourseOutcome, resetTLATasks } =
    useCourseRevisionStore();
  const [selectedCOIndex, setSelectedCOIndex] = useState(0);
  const [customTeachingMethods, setCustomTeachingMethods] = useState<string[]>(
    []
  );
  const [customLearningResources, setCustomLearningResources] = useState<
    string[]
  >([]);
  const [newTeachingMethod, setNewTeachingMethod] = useState("");
  const [newLearningResource, setNewLearningResource] = useState("");
  const [isAddingTeachingMethod, setIsAddingTeachingMethod] = useState(false);
  const [isAddingLearningResource, setIsAddingLearningResource] =
    useState(false);

  // Get all available teaching methods (default + custom)
  const getAllTeachingMethods = () => {
    return [...defaultTeachingMethods, ...customTeachingMethods];
  };

  // Get all available learning resources (default + custom)
  const getAllLearningResources = () => {
    return [...defaultLearningResources, ...customLearningResources];
  };

  // Calculate total counts across all course outcomes
  const calculateTotalCounts = () => {
    const allTeachingMethods = new Set<string>();
    const allLearningResources = new Set<string>();

    courseOutcomes.forEach((outcome) => {
      if (outcome.tla_assessment_method) {
        outcome.tla_assessment_method.teaching_methods?.forEach((method) =>
          allTeachingMethods.add(method)
        );
        outcome.tla_assessment_method.learning_resources?.forEach((resource) =>
          allLearningResources.add(resource)
        );
      }
    });

    return {
      teachingMethods: allTeachingMethods.size,
      learningResources: allLearningResources.size,
    };
  };

  // Get status for a course outcome
  const getCOStatus = (coIndex: number) => {
    const outcome = courseOutcomes[coIndex];
    if (!outcome?.tla_assessment_method) {
      return { status: "warning", text: "None selected", icon: AlertTriangle };
    }

    const hasTeachingMethods =
      outcome.tla_assessment_method.teaching_methods?.length > 0;
    const hasLearningResources =
      outcome.tla_assessment_method.learning_resources?.length > 0;

    if (hasTeachingMethods && hasLearningResources) {
      return { status: "success", text: "Complete", icon: CheckCircle };
    }

    return { status: "warning", text: "Incomplete", icon: AlertTriangle };
  };

  // Get selected count for teaching methods
  const getSelectedTeachingMethodsCount = (coIndex: number) => {
    const outcome = courseOutcomes[coIndex];
    return outcome?.tla_assessment_method?.teaching_methods?.length || 0;
  };

  // Get selected count for learning resources
  const getSelectedLearningResourcesCount = (coIndex: number) => {
    const outcome = courseOutcomes[coIndex];
    return outcome?.tla_assessment_method?.learning_resources?.length || 0;
  };

  // Update teaching methods for the selected course outcome
  const handleTeachingMethodChange = (method: string, checked: boolean) => {
    const selectedOutcome = courseOutcomes[selectedCOIndex];
    if (!selectedOutcome) return;

    const currentMethods =
      selectedOutcome.tla_assessment_method?.teaching_methods || [];
    const updatedMethods = checked
      ? [...currentMethods, method]
      : currentMethods.filter((m) => m !== method);

    updateCourseOutcome(selectedOutcome.id, {
      tla_assessment_method: {
        ...selectedOutcome.tla_assessment_method,
        teaching_methods: updatedMethods,
        learning_resources:
          selectedOutcome.tla_assessment_method?.learning_resources || [],
      },
    });
  };

  // Update learning resources for the selected course outcome
  const handleLearningResourceChange = (resource: string, checked: boolean) => {
    const selectedOutcome = courseOutcomes[selectedCOIndex];
    if (!selectedOutcome) return;

    const currentResources =
      selectedOutcome.tla_assessment_method?.learning_resources || [];
    const updatedResources = checked
      ? [...currentResources, resource]
      : currentResources.filter((r) => r !== resource);

    updateCourseOutcome(selectedOutcome.id, {
      tla_assessment_method: {
        ...selectedOutcome.tla_assessment_method,
        teaching_methods:
          selectedOutcome.tla_assessment_method?.teaching_methods || [],
        learning_resources: updatedResources,
      },
    });
  };

  // Add custom teaching method
  const handleAddTeachingMethod = () => {
    const method = newTeachingMethod.trim();
    if (method && !getAllTeachingMethods().includes(method)) {
      setCustomTeachingMethods((prev) => [...prev, method]);
      handleTeachingMethodChange(method, true);
    }
    setNewTeachingMethod("");
    setIsAddingTeachingMethod(false);
  };

  // Add custom learning resource
  const handleAddLearningResource = () => {
    const resource = newLearningResource.trim();
    if (resource && !getAllLearningResources().includes(resource)) {
      setCustomLearningResources((prev) => [...prev, resource]);
      handleLearningResourceChange(resource, true);
    }
    setNewLearningResource("");
    setIsAddingLearningResource(false);
  };

  // Reset to original state
  const handleReset = () => {
    resetTLATasks();
    setCustomTeachingMethods([]);
    setCustomLearningResources([]);
  };

  const totalCounts = calculateTotalCounts();

  return (
    <div className="space-y-6">
      {/* Header Alert */}
      <Alert className="bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Teaching Methods and Learning Resources</strong>
          <br />
          Select teaching methods and learning resources for each Course
          Outcome.
          <br />
          Each CO must have at least one teaching method and one learning
          resource.
        </AlertDescription>
      </Alert>

      {/* Summary Counts */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Teaching Methods: {totalCounts.teachingMethods}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Learning Resources: {totalCounts.learningResources}
          </Badge>
        </div>
      </div>

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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Teaching Methods Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-medium">
                          Teaching Methods
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSelectedTeachingMethodsCount(coIndex) > 0 ? (
                          <Badge className="bg-green-100 text-green-800">
                            {getSelectedTeachingMethodsCount(coIndex)} selected
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-amber-600 border-amber-600"
                          >
                            None selected
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {getAllTeachingMethods().map((method) => {
                        const isSelected =
                          outcome.tla_assessment_method?.teaching_methods?.includes(
                            method
                          ) || false;
                        return (
                          <div
                            key={method}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`teaching-${coIndex}-${method}`}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleTeachingMethodChange(
                                  method,
                                  checked as boolean
                                )
                              }
                            />
                            <label
                              htmlFor={`teaching-${coIndex}-${method}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {method}
                            </label>
                          </div>
                        );
                      })}

                      {/* Add new teaching method */}
                      {isAddingTeachingMethod ? (
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newTeachingMethod}
                            onChange={(e) =>
                              setNewTeachingMethod(e.target.value)
                            }
                            placeholder="Enter new teaching method"
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddTeachingMethod();
                              } else if (e.key === "Escape") {
                                setIsAddingTeachingMethod(false);
                                setNewTeachingMethod("");
                              }
                            }}
                          />
                          <Button size="sm" onClick={handleAddTeachingMethod}>
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsAddingTeachingMethod(false);
                              setNewTeachingMethod("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddingTeachingMethod(true)}
                          className="w-full mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add new teaching method...
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Learning Resources Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-medium">
                          Learning Resources
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSelectedLearningResourcesCount(coIndex) > 0 ? (
                          <Badge className="bg-green-100 text-green-800">
                            {getSelectedLearningResourcesCount(coIndex)}{" "}
                            selected
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-amber-600 border-amber-600"
                          >
                            None selected
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {getAllLearningResources().map((resource) => {
                        const isSelected =
                          outcome.tla_assessment_method?.learning_resources?.includes(
                            resource
                          ) || false;
                        return (
                          <div
                            key={resource}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`resource-${coIndex}-${resource}`}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleLearningResourceChange(
                                  resource,
                                  checked as boolean
                                )
                              }
                            />
                            <label
                              htmlFor={`resource-${coIndex}-${resource}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {resource}
                            </label>
                          </div>
                        );
                      })}

                      {/* Add new learning resource */}
                      {isAddingLearningResource ? (
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newLearningResource}
                            onChange={(e) =>
                              setNewLearningResource(e.target.value)
                            }
                            placeholder="Enter new learning resource"
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddLearningResource();
                              } else if (e.key === "Escape") {
                                setIsAddingLearningResource(false);
                                setNewLearningResource("");
                              }
                            }}
                          />
                          <Button size="sm" onClick={handleAddLearningResource}>
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsAddingLearningResource(false);
                              setNewLearningResource("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddingLearningResource(true)}
                          className="w-full mt-2 text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add new learning resource...
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Teaching and Learning Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Teaching and Learning Summary</CardTitle>
          <p className="text-sm text-gray-600">
            Overview of teaching methods and learning resources across course
            outcomes
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CO</TableHead>
                <TableHead>CO Statement</TableHead>
                <TableHead>Teaching Methods</TableHead>
                <TableHead>Learning Resources</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseOutcomes.map((outcome, index) => {
                const status = getCOStatus(index);
                const teachingMethods =
                  outcome.tla_assessment_method?.teaching_methods || [];
                const learningResources =
                  outcome.tla_assessment_method?.learning_resources || [];

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">CO{index + 1}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={outcome.statement}>
                        {outcome.statement}
                      </div>
                    </TableCell>
                    <TableCell>
                      {teachingMethods.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {teachingMethods.map((method, methodIndex) => (
                            <Badge
                              key={methodIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              {method}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          None selected
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {learningResources.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {learningResources.map((resource, resourceIndex) => (
                            <Badge
                              key={resourceIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          None selected
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          status.status === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {status.text}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleReset}
          className="text-gray-600"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Original
        </Button>
      </div>
    </div>
  );
}
