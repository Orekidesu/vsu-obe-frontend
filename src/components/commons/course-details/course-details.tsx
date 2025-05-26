"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
// Remove mock data import
// import { mockCourseData } from "./mock-data/mock-course-data";

// Import the curriculum courses hook
import useCurriculumCourses from "@/hooks/faculty-member/useCourseCurriculum";

// Helper functions for mapping API data
const getCPAClassificationName = (cpa: string) => {
  switch (cpa) {
    case "C":
      return "Cognitive";
    case "P":
      return "Psychomotor";
    case "A":
      return "Affective";
    default:
      return "Unknown";
  }
};

const getIEDName = (ied: string) => {
  switch (ied) {
    case "I":
      return "Introductory";
    case "E":
      return "Enabling";
    case "D":
      return "Demonstrative";
    default:
      return "Unknown";
  }
};

interface CurriculumCourseDetailsProps {
  curriculumCourseId: string;
}

const formatSemester = (semester: { year: number; sem: string }) => {
  const semesterName =
    semester.sem.charAt(0).toUpperCase() + semester.sem.slice(1);
  return `Year ${semester.year} - ${semesterName} Semester`;
};

export function CurriculumCourseDetails({
  curriculumCourseId,
}: CurriculumCourseDetailsProps) {
  const [activeTab, setActiveTab] = useState("course-details");
  const [expandedOutcomes, setExpandedOutcomes] = useState<
    Record<number, boolean>
  >({});
  const [expandedAssessments, setExpandedAssessments] = useState<
    Record<number, boolean>
  >({});

  // Get the curriculum course data from the API
  const { getCurriculumCourse } = useCurriculumCourses({
    includeOutcomes: true, // Make sure we get the outcomes
  });

  const courseId = parseInt(curriculumCourseId, 10);
  const {
    data: courseData,
    error: courseError,
    isLoading,
  } = useQuery(getCurriculumCourse(courseId, true));

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto h-[500px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
          <h2 className="text-xl font-medium">Loading course data...</h2>
        </div>
      </div>
    );
  }

  // Handle error state
  if (courseError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col justify-center items-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Course</h2>
          <p className="text-gray-600 mb-6 text-center">
            {courseError instanceof Error
              ? courseError.message
              : "The requested course could not be loaded."}
          </p>
        </div>
      </div>
    );
  }

  // Handle no data state
  if (!courseData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col justify-center items-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6 text-center">
            The requested course could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Use the actual course data instead of mock data
  const course = courseData;

  // Calculate total assessment weight
  const totalAssessmentWeight =
    course.course_outcomes?.reduce(
      (total, outcome) =>
        total +
        (outcome.tla_tasks?.reduce(
          (sum, task) => sum + Number.parseFloat(task.weight || "0"),
          0
        ) || 0),
      0
    ) || 0;

  const toggleOutcome = (outcomeId: number) => {
    setExpandedOutcomes((prev) => ({
      ...prev,
      [outcomeId]: !prev[outcomeId],
    }));
  };

  const toggleAssessment = (outcomeId: number) => {
    setExpandedAssessments((prev) => ({
      ...prev,
      [outcomeId]: !prev[outcomeId],
    }));
  };

  const getContributionLevelColor = (level: string) => {
    switch (level) {
      case "Introductory":
        return "bg-blue-100 text-blue-800";
      case "Enabling":
        return "bg-green-100 text-green-800";
      case "Demonstrative":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCPAClassificationColor = (classification: string) => {
    switch (classification) {
      case "Cognitive":
        return "bg-blue-100 text-blue-800";
      case "Psychomotor":
        return "bg-purple-100 text-purple-800";
      case "Affective":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if course outcomes exist
  const hasOutcomes =
    course.course_outcomes && course.course_outcomes.length > 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {course.course.code}: {course.course.descriptive_title}
        </h1>
        <p className="text-base">
          {course.course_category.name} • {formatSemester(course.semester)} •{" "}
          {typeof course.units === "string"
            ? Number.parseFloat(course.units).toFixed(2)
            : course.units.toFixed(2)}
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="course-details">Course Details</TabsTrigger>
          <TabsTrigger value="course-outcomes">Course Outcomes</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        {/* Course Details Tab */}
        <TabsContent value="course-details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Course Code
                    </h4>
                    <p className="text-base">{course.course.code}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Category
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        {course.course_category.code}
                      </Badge>
                      <span>{course.course_category.name}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Units
                    </h4>
                    <p className="text-muted-foreground">
                      {course.course_category.name} •{" "}
                      {formatSemester(course.semester)} •{" "}
                      {typeof course.units === "string"
                        ? Number.parseFloat(course.units).toFixed(2)
                        : course.units.toFixed(2)}{" "}
                      Units
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Course Title
                    </h4>
                    <p className="text-base">
                      {course.course.descriptive_title}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Semester
                    </h4>
                    <p className="text-base">
                      {formatSemester(course.semester)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Category Name
                  </h4>
                  <p className="text-base">{course.course_category.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Category Code
                  </h4>
                  <Badge className="bg-green-100 text-green-800">
                    {course.course_category.code}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Outcomes Tab */}
        <TabsContent value="course-outcomes" className="space-y-4">
          {!hasOutcomes ? (
            <div className="text-center p-10 border rounded-lg">
              <AlertCircle className="h-10 w-10 mx-auto mb-4 text-amber-500" />
              <h3 className="text-lg font-medium mb-2">No Course Outcomes</h3>
              <p className="text-muted-foreground">
                This course does not have any defined outcomes yet.
              </p>
            </div>
          ) : (
            course.course_outcomes?.map((outcome) => (
              <Collapsible
                key={outcome.id}
                open={expandedOutcomes[outcome.id]}
                onOpenChange={() => toggleOutcome(outcome.id)}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                          >
                            {expandedOutcomes[outcome.id] ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <CardTitle className="text-xl">
                            {outcome.name}
                          </CardTitle>
                        </div>
                        <Badge
                          className={getCPAClassificationColor(
                            getCPAClassificationName(outcome.cpa)
                          )}
                        >
                          {getCPAClassificationName(outcome.cpa)}
                        </Badge>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      {/* Statement */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          Statement
                        </h4>
                        <p className="text-base leading-relaxed">
                          {outcome.statement}
                        </p>
                      </div>

                      {/* ABCD Components */}
                      {outcome.abcd && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">
                            ABCD Components
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">
                                AUDIENCE
                              </h5>
                              <p className="text-base">
                                {outcome.abcd.audience}
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">
                                BEHAVIOR
                              </h5>
                              <p className="text-base">
                                {outcome.abcd.behavior}
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">
                                CONDITION
                              </h5>
                              <p className="text-base">
                                {outcome.abcd.condition}
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">
                                DEGREE
                              </h5>
                              <p className="text-base">{outcome.abcd.degree}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PO Mappings */}
                      {outcome.po_mappings &&
                        outcome.po_mappings.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">
                              PO Mappings
                            </h4>
                            <div className="space-y-4">
                              {outcome.po_mappings.map((mapping) => (
                                <div
                                  key={mapping.po_id}
                                  className="flex items-start justify-between p-4 border rounded-lg"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-medium">
                                        {mapping.po_name ??
                                          `PO ${mapping.po_id}`}
                                      </span>
                                      <Badge
                                        className={getContributionLevelColor(
                                          getIEDName(mapping.ied)
                                        )}
                                      >
                                        {getIEDName(mapping.ied)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {mapping.po_statement ??
                                        "No statement available"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))
          )}
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-6">
          {!hasOutcomes ? (
            <div className="text-center p-10 border rounded-lg">
              <AlertCircle className="h-10 w-10 mx-auto mb-4 text-amber-500" />
              <h3 className="text-lg font-medium mb-2">
                No Assessments Available
              </h3>
              <p className="text-muted-foreground">
                This course does not have any defined outcomes or assessments
                yet.
              </p>
            </div>
          ) : (
            <>
              {/* Assessment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium">
                          Overall Assessment Weight
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Total weight across all course outcomes
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                        {totalAssessmentWeight.toFixed(2)}%
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">
                          Course Outcomes
                        </h5>
                        {course.course_outcomes?.map((outcome, index) => {
                          const outcomeWeight =
                            outcome.tla_tasks?.reduce(
                              (sum, task) =>
                                sum + Number.parseFloat(task.weight || "0"),
                              0
                            ) || 0;
                          return (
                            <div
                              key={outcome.id}
                              className="flex items-center justify-between py-2"
                            >
                              <span className="text-sm">
                                <span className="font-bold">{`CO ${index + 1}. `}</span>
                                {outcome.name}
                              </span>
                              <Badge variant="outline">
                                {outcomeWeight.toFixed(2)}%
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">
                          Assessment Distribution
                        </h5>
                        <div className="space-y-2">
                          {course.course_outcomes?.map((outcome) => {
                            const outcomeWeight =
                              outcome.tla_tasks?.reduce(
                                (sum, task) =>
                                  sum + Number.parseFloat(task.weight || "0"),
                                0
                              ) || 0;
                            const percentage =
                              totalAssessmentWeight > 0
                                ? (outcomeWeight / totalAssessmentWeight) * 100
                                : 0;
                            return (
                              <div key={outcome.id} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="truncate">
                                    {outcome.name}
                                  </span>
                                  <span>{percentage.toFixed(1)}%</span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assessment Tasks by Course Outcome */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Tasks by Course Outcome</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.course_outcomes?.map((outcome) => {
                    const outcomeWeight =
                      outcome.tla_tasks?.reduce(
                        (sum, task) =>
                          sum + Number.parseFloat(task.weight || "0"),
                        0
                      ) || 0;
                    return (
                      <Collapsible
                        key={outcome.id}
                        open={expandedAssessments[outcome.id]}
                        onOpenChange={() => toggleAssessment(outcome.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 h-auto"
                              >
                                {expandedAssessments[outcome.id] ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              <h4 className="text-lg font-medium">
                                {outcome.name}
                              </h4>
                            </div>
                            <Badge variant="outline">
                              Total: {outcomeWeight.toFixed(2)}%
                            </Badge>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 space-y-4">
                            <p className="text-sm text-muted-foreground">
                              {outcome.statement}
                            </p>
                            {outcome.tla_tasks &&
                            outcome.tla_tasks.length > 0 ? (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Tool</TableHead>
                                    <TableHead className="text-right">
                                      Weight
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {outcome.tla_tasks.map((task) => (
                                    <TableRow key={task.id}>
                                      <TableCell className="font-medium">
                                        {task.at_code}
                                      </TableCell>
                                      <TableCell>{task.at_name}</TableCell>
                                      <TableCell>{task.at_tool}</TableCell>
                                      <TableCell className="text-right">
                                        {Number.parseFloat(
                                          task.weight || "0"
                                        ).toFixed(2)}
                                        %
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                No assessment tasks defined for this outcome.
                              </p>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Teaching and Learning Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Teaching and Learning Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  {course.course_outcomes?.map((outcome) => (
                    <div key={outcome.id} className="space-y-4 mb-8 last:mb-0">
                      <h4 className="text-lg font-medium">{outcome.name}</h4>
                      {outcome.tla_assessment_method ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                              Teaching Methods
                            </h5>
                            {outcome.tla_assessment_method.teaching_methods &&
                            outcome.tla_assessment_method.teaching_methods
                              .length > 0 ? (
                              <ul className="space-y-1">
                                {outcome.tla_assessment_method.teaching_methods.map(
                                  (method, index) => (
                                    <li
                                      key={index}
                                      className="text-sm flex items-center"
                                    >
                                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                      {method}
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                No teaching methods defined.
                              </p>
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                              Learning Resources
                            </h5>
                            {outcome.tla_assessment_method.learning_resources &&
                            outcome.tla_assessment_method.learning_resources
                              .length > 0 ? (
                              <ul className="space-y-1">
                                {outcome.tla_assessment_method.learning_resources.map(
                                  (resource, index) => (
                                    <li
                                      key={index}
                                      className="text-sm flex items-center"
                                    >
                                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                      {resource}
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                No learning resources defined.
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No teaching and learning methods defined for this
                          outcome.
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
