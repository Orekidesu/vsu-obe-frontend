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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Info,
  CheckCircle2,
  AlertCircle,
  Plus,
  BookOpen,
  Presentation,
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
  TeachingMethod,
  LearningResource,
} from "@/store/course/course-store";

interface CourseOutcomesTLStepProps {
  courseOutcomes: CourseOutcome[];
  teachingMethods: TeachingMethod[];
  learningResources: LearningResource[];
  addTeachingMethod: (name: string) => void;
  removeTeachingMethod: (id: string) => void;
  addLearningResource: (name: string) => void;
  removeLearningResource: (id: string) => void;
  getCOTeachingMethods: (courseOutcomeId: number) => string[];
  getCOLearningResources: (courseOutcomeId: number) => string[];
  updateCOTeachingMethods: (
    courseOutcomeId: number,
    methodIds: string[]
  ) => void;
  updateCOLearningResources: (
    courseOutcomeId: number,
    resourceIds: string[]
  ) => void;
}

export function CourseOutcomesTLStep({
  courseOutcomes,
  teachingMethods,
  learningResources,
  addTeachingMethod,
  // removeTeachingMethod,
  addLearningResource,
  // removeLearningResource,
  getCOTeachingMethods,
  getCOLearningResources,
  updateCOTeachingMethods,
  updateCOLearningResources,
}: CourseOutcomesTLStepProps) {
  const [activeTab, setActiveTab] = useState<string>(
    courseOutcomes[0]?.id.toString() || "1"
  );
  const [newTeachingMethod, setNewTeachingMethod] = useState("");
  const [newLearningResource, setNewLearningResource] = useState("");

  // Helper function to check if a CO has at least one teaching method
  const hasAtLeastOneTeachingMethod = (courseOutcomeId: number): boolean => {
    const methods = getCOTeachingMethods(courseOutcomeId);
    return methods.length > 0;
  };

  // Helper function to check if a CO has at least one learning resource
  const hasAtLeastOneLearningResource = (courseOutcomeId: number): boolean => {
    const resources = getCOLearningResources(courseOutcomeId);
    return resources.length > 0;
  };

  // Helper function to toggle a teaching method for a CO
  const toggleTeachingMethod = (courseOutcomeId: number, methodId: string) => {
    const currentMethods = getCOTeachingMethods(courseOutcomeId);
    const updatedMethods = currentMethods.includes(methodId)
      ? currentMethods.filter((id) => id !== methodId)
      : [...currentMethods, methodId];
    updateCOTeachingMethods(courseOutcomeId, updatedMethods);
  };

  // Helper function to toggle a learning resource for a CO
  const toggleLearningResource = (
    courseOutcomeId: number,
    resourceId: string
  ) => {
    const currentResources = getCOLearningResources(courseOutcomeId);
    const updatedResources = currentResources.includes(resourceId)
      ? currentResources.filter((id) => id !== resourceId)
      : [...currentResources, resourceId];
    updateCOLearningResources(courseOutcomeId, updatedResources);
  };

  // Handle adding a new teaching method
  const handleAddTeachingMethod = () => {
    if (newTeachingMethod.trim()) {
      addTeachingMethod(newTeachingMethod.trim());
      setNewTeachingMethod("");
    }
  };

  // Handle adding a new learning resource
  const handleAddLearningResource = () => {
    if (newLearningResource.trim()) {
      addLearningResource(newLearningResource.trim());
      setNewLearningResource("");
    }
  };

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
              Teaching Methods and Learning Resources
            </h3>
            <p className="text-sm text-blue-700">
              Select teaching methods and learning resources for each Course
              Outcome.
            </p>
            <p className="text-sm text-blue-700">
              Each CO must have at least one teaching method and one learning
              resource.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center">
                <Presentation className="h-3 w-3 mr-1" />
                Teaching Methods: {teachingMethods.length}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                Learning Resources: {learningResources.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Course Outcomes */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-4">
          {courseOutcomes.map((co) => {
            const hasMethods = hasAtLeastOneTeachingMethod(co.id);
            const hasResources = hasAtLeastOneLearningResource(co.id);
            const isValid = hasMethods && hasResources;

            return (
              <TabsTrigger
                key={co.id}
                value={co.id.toString()}
                className="relative"
              >
                CO{co.id}
                {isValid ? (
                  <CheckCircle2 className="h-3 w-3 text-green-500 absolute -top-1 -right-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {courseOutcomes.map((co) => {
          const selectedMethods = getCOTeachingMethods(co.id);
          const selectedResources = getCOLearningResources(co.id);
          const hasMethods = selectedMethods.length > 0;
          const hasResources = selectedResources.length > 0;

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Teaching Methods */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium flex items-center">
                          <Presentation className="h-4 w-4 mr-2" />
                          Teaching Methods
                        </h3>
                        <div className="flex items-center space-x-2">
                          {hasMethods ? (
                            <span className="text-xs text-green-600 flex items-center">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {selectedMethods.length} selected
                            </span>
                          ) : (
                            <span className="text-xs text-amber-600 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              None selected
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border rounded-md p-4 bg-gray-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                          {teachingMethods.map((method) => (
                            <div
                              key={method.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`tm-${co.id}-${method.id}`}
                                checked={selectedMethods.includes(method.id)}
                                onCheckedChange={() =>
                                  toggleTeachingMethod(co.id, method.id)
                                }
                              />
                              <label
                                htmlFor={`tm-${co.id}-${method.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {method.name}
                              </label>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center space-x-2">
                          <Input
                            placeholder="Add new teaching method..."
                            value={newTeachingMethod}
                            onChange={(e) =>
                              setNewTeachingMethod(e.target.value)
                            }
                            className="h-8"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTeachingMethod();
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleAddTeachingMethod}
                            className="h-8 px-2"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Learning Resources */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Learning Resources
                        </h3>
                        <div className="flex items-center space-x-2">
                          {hasResources ? (
                            <span className="text-xs text-green-600 flex items-center">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {selectedResources.length} selected
                            </span>
                          ) : (
                            <span className="text-xs text-amber-600 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              None selected
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border rounded-md p-4 bg-gray-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                          {learningResources.map((resource) => (
                            <div
                              key={resource.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`lr-${co.id}-${resource.id}`}
                                checked={selectedResources.includes(
                                  resource.id
                                )}
                                onCheckedChange={() =>
                                  toggleLearningResource(co.id, resource.id)
                                }
                              />
                              <label
                                htmlFor={`lr-${co.id}-${resource.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {resource.name}
                              </label>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center space-x-2">
                          <Input
                            placeholder="Add new learning resource..."
                            value={newLearningResource}
                            onChange={(e) =>
                              setNewLearningResource(e.target.value)
                            }
                            className="h-8"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddLearningResource();
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleAddLearningResource}
                            className="h-8 px-2"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
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
                  const hasMethods = selectedMethods.length > 0;
                  const hasResources = selectedResources.length > 0;
                  const isValid = hasMethods && hasResources;

                  // Get the names of selected methods and resources
                  const methodNames = selectedMethods
                    .map(
                      (id) =>
                        teachingMethods.find((m) => m.id === id)?.name || ""
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
    </div>
  );
}
