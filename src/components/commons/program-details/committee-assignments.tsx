import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, CheckCircle2, Clock, AlertCircle, SendIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Committee {
  id: string;
  name: string;
  email: string;
  description: string;
}

interface CommitteeAssignment {
  committeeId: string;
  courseId: string;
  isCompleted: boolean; // Added isCompleted property
}

interface Course {
  code: string;
  descriptive_title: string;
}

interface CommitteeAssignmentsProps {
  committees: Committee[];
  committeeAssignments: CommitteeAssignment[];
  courses: Course[];

  onSubmitForReview?: () => void; // New prop for submit handler
  showReadyForReviewButton?: boolean;
}

export function CommitteeAssignments({
  committees,
  committeeAssignments,
  courses,
  onSubmitForReview,
  showReadyForReviewButton = true,
}: CommitteeAssignmentsProps) {
  // Helper function to get course details by ID
  const getCourseById = (courseId: string) => {
    return courses.find((course) => course.code === courseId);
  };

  // Helper function to get courses assigned to a committee
  const getCoursesForCommittee = (committeeId: string) => {
    return committeeAssignments.filter(
      (assignment) => assignment.committeeId === committeeId
    );
  };

  // Helper function to check if a course is assigned to any committee
  const isCourseAssigned = (courseId: string) => {
    return committeeAssignments.some(
      (assignment) => assignment.courseId === courseId
    );
  };

  // Get unassigned courses
  const unassignedCourses = courses.filter(
    (course) => !isCourseAssigned(course.code)
  );

  // Get the total number of assigned courses
  const totalAssignedCourses = [
    ...new Set(committeeAssignments.map((a) => a.courseId)),
  ].length;

  // Get the total number of completed courses
  const completedCourses = [
    ...new Set(
      committeeAssignments
        .filter((assignment) => assignment.isCompleted)
        .map((assignment) => assignment.courseId)
    ),
  ].length;

  // Get the completion percentage (courses with completed details)
  const completionPercentage =
    courses.length > 0
      ? Math.round((completedCourses / courses.length) * 100)
      : 0;

  // Get the assignment percentage (courses assigned to committees)
  const assignmentPercentage =
    courses.length > 0
      ? Math.round((totalAssignedCourses / courses.length) * 100)
      : 0;
  // Check if all assigned courses are completed
  const allCoursesCompleted =
    totalAssignedCourses > 0 && completedCourses === totalAssignedCourses;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Committee Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {committees.length === 0 ? (
            <div className="text-center p-6 bg-muted rounded-md">
              <h3 className="text-xl font-medium mb-2">
                No Committees Assigned
              </h3>
              <p className="text-muted-foreground">
                There are currently no committee members assigned to this
                program.
              </p>
            </div>
          ) : (
            <>
              {/* Assignment status cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Assignment card */}
                <Card className="border-blue-100 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-blue-800">
                          Assignment Status
                        </h3>
                        <p className="text-sm text-blue-700">
                          {totalAssignedCourses} of {courses.length} courses
                          assigned ({assignmentPercentage}%)
                        </p>
                      </div>
                      <div className="w-24 h-24 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-semibold text-blue-800">
                            {assignmentPercentage}%
                          </span>
                        </div>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#dbeafe"
                            strokeWidth="10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="10"
                            strokeDasharray="251.2"
                            strokeDashoffset={
                              251.2 - (251.2 * assignmentPercentage) / 100
                            }
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Completion card */}
                <Card className="border-green-100 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-green-800">
                          Completion Status
                        </h3>
                        <p className="text-sm text-green-700">
                          {completedCourses} of {courses.length} courses
                          completed ({completionPercentage}%)
                        </p>
                      </div>
                      <div className="w-24 h-24 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-semibold text-green-800">
                            {completionPercentage}%
                          </span>
                        </div>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#e0f2f1"
                            strokeWidth="10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeDasharray="251.2"
                            strokeDashoffset={
                              251.2 - (251.2 * completionPercentage) / 100
                            }
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Accordion type="multiple" className="space-y-4">
                {committees.map((committee) => {
                  const assignedCourses = getCoursesForCommittee(committee.id);
                  const completedCount = assignedCourses.filter(
                    (c) => c.isCompleted
                  ).length;
                  const pendingCount = assignedCourses.length - completedCount;

                  return (
                    <AccordionItem
                      key={committee.id}
                      value={committee.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                        <div className="flex items-center gap-2 w-full">
                          <Avatar className="h-10 w-10 mr-2">
                            <AvatarFallback>{committee.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <h3 className="text-base font-medium">
                              {committee.name}
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Mail className="h-3 w-3 mr-1" />
                              {committee.email}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                              {assignedCourses.length} courses
                            </Badge>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="flex items-center text-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-0.5" />
                                {completedCount}
                              </span>
                              <span className="mx-1">/</span>
                              <span className="flex items-center text-amber-600">
                                <Clock className="h-3 w-3 mr-0.5" />
                                {pendingCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4">
                        <p className="text-muted-foreground mb-4">
                          {committee.description}
                        </p>

                        {assignedCourses.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {assignedCourses.map((assignment) => {
                              const course = getCourseById(assignment.courseId);
                              return (
                                <TooltipProvider key={assignment.courseId}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Card
                                        className={`border ${
                                          assignment.isCompleted
                                            ? "border-green-200 bg-green-50"
                                            : "border-amber-200 bg-amber-50"
                                        }`}
                                      >
                                        <CardContent className="p-4">
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <h4 className="font-medium">
                                                {assignment.courseId}
                                              </h4>
                                              <p className="text-sm text-muted-foreground">
                                                {course?.descriptive_title ||
                                                  "Unknown"}
                                              </p>
                                            </div>
                                            {assignment.isCompleted ? (
                                              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                            ) : (
                                              <Clock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {assignment.isCompleted
                                          ? "Course details completed"
                                          : "Course details pending"}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">
                            No courses assigned to this committee member.
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}

                {unassignedCourses.length > 0 && (
                  <AccordionItem
                    value="unassigned"
                    className="border border-yellow-200 rounded-lg overflow-hidden bg-yellow-50"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-yellow-100/50">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-xl font-medium">
                          Unassigned Courses
                        </h3>
                        <Badge
                          variant="outline"
                          className="ml-2 border-yellow-500 text-yellow-700"
                        >
                          {unassignedCourses.length} courses
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4">
                      <p className="text-yellow-700 mb-4">
                        The following courses have not been assigned to any
                        committee for review:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {unassignedCourses.map((course) => (
                          <Card
                            key={course.code}
                            className="border border-yellow-200"
                          >
                            <CardContent className="p-4">
                              <h4 className="font-medium">{course.code}</h4>
                              <p className="text-sm text-muted-foreground">
                                {course.descriptive_title}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </>
          )}
        </CardContent>
        {allCoursesCompleted &&
          showReadyForReviewButton &&
          onSubmitForReview && (
            <CardFooter className="bg-green-50 border-t border-green-100">
              <div className="w-full flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-green-800">
                    All courses completed!
                  </h3>
                  <p className="text-green-700 text-sm">
                    All {completedCourses} courses have been completed by
                    committee members. This program is ready for review.
                  </p>
                </div>
                <Button
                  onClick={onSubmitForReview}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <SendIcon className="h-4 w-4 mr-2" />
                  Ready for Review
                </Button>
              </div>
            </CardFooter>
          )}
      </Card>

      {committees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Committee Workload and Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {committees.map((committee) => {
                const assignedCourses = getCoursesForCommittee(committee.id);
                const completedCourses = assignedCourses.filter(
                  (c) => c.isCompleted
                );

                const assignmentPercentage =
                  courses.length > 0
                    ? (assignedCourses.length / courses.length) * 100
                    : 0;

                const completionPercentage =
                  assignedCourses.length > 0
                    ? (completedCourses.length / assignedCourses.length) * 100
                    : 0;

                return (
                  <div key={committee.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{committee.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {completedCourses.length} of {assignedCourses.length}{" "}
                        completed
                      </span>
                    </div>

                    {/* Workload bar */}
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Workload: {assignedCourses.length} courses (
                        {assignmentPercentage.toFixed(1)}% of total)
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${assignmentPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Completion bar */}
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Progress: {completionPercentage.toFixed(1)}% complete
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
