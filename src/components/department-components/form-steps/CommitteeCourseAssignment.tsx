import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type {
  Committee,
  CurriculumCourse,
  YearSemester,
  CommitteeCourseAssignment,
} from "@/store/wizard-store";

interface CommitteeCourseAssignmentStepProps {
  committees: Committee[];
  selectedCommittees: number[];
  curriculumCourses: CurriculumCourse[];
  yearSemesters: YearSemester[];
  committeeCourseAssignments: CommitteeCourseAssignment[];
  assignCourseToCommittee: (committeeId: number, courseId: number) => void;
  removeCourseAssignment: (courseId: number) => void;
  getCommitteeForCourse: (courseId: number) => number | null;
}

export function CommitteeCourseAssignmentStep({
  committees,
  selectedCommittees,
  curriculumCourses,
  yearSemesters,
  committeeCourseAssignments,
  assignCourseToCommittee,
  removeCourseAssignment,
  getCommitteeForCourse,
}: CommitteeCourseAssignmentStepProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("by-committee");
  const [expandedCommittees, setExpandedCommittees] = useState<string[]>([]);

  // Get semester display name
  const getSemesterName = (semesterCode: string) => {
    switch (semesterCode) {
      case "first":
        return "First Semester";
      case "second":
        return "Second Semester";
      case "midyear":
        return "Midyear";
      default:
        return semesterCode;
    }
  };

  // Filter courses based on search term
  const filteredCourses = curriculumCourses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.descriptive_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group courses by year-semester
  const groupedCourses: Record<string, CurriculumCourse[]> = {};
  yearSemesters.forEach((ys) => {
    groupedCourses[ys.id] = curriculumCourses.filter(
      (cc) => cc.yearSemesterId === ys.id
    );
  });

  // Get courses assigned to a specific committee
  const getCoursesForCommittee = (committeeId: number) => {
    return committeeCourseAssignments
      .filter((assignment) => assignment.committeeId === committeeId)
      .map((assignment) => assignment.courseId);
  };

  // Get committee name by ID
  const getCommitteeName = (committeeId: number) => {
    const committee = committees.find((c) => c.id === committeeId);
    return committee
      ? `${committee.first_name} ${committee.last_name}`
      : "Unknown";
  };

  // Count unassigned courses
  const unassignedCoursesCount = curriculumCourses.filter(
    (course) =>
      !committeeCourseAssignments.some(
        (assignment) => assignment.courseId === course.id
      )
  ).length;

  // Toggle accordion item
  // const toggleCommitteeAccordion = (committeeId: number) => {
  //   setExpandedCommittees((prev) =>
  //     prev.includes(String(committeeId))
  //       ? prev.filter((id) => id !== String(committeeId))
  //       : [...prev, String(committeeId)]
  //   );
  // };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Assign Courses to Committees
      </h2>

      <div className="space-y-6">
        {/* Assignment summary */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Assignment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Total Courses
                </span>
                <span className="text-2xl font-semibold">
                  {curriculumCourses.length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Assigned Courses
                </span>
                <span className="text-2xl font-semibold">
                  {committeeCourseAssignments.length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Unassigned Courses
                </span>
                <span
                  className={`text-2xl font-semibold ${unassignedCoursesCount > 0 ? "text-amber-500" : "text-green-500"}`}
                >
                  {unassignedCoursesCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="by-committee">Assign by Committee</TabsTrigger>
            <TabsTrigger value="by-course">Assign by Course</TabsTrigger>
          </TabsList>

          {/* Assign by Committee View */}
          <TabsContent value="by-committee" className="space-y-6">
            {selectedCommittees.length === 0 ? (
              <Alert
                variant="destructive"
                className="bg-amber-50 border-amber-200 text-amber-800"
              >
                <AlertDescription>
                  No committees have been selected. Please go back to the
                  committee selection step.
                </AlertDescription>
              </Alert>
            ) : (
              <Accordion
                type="multiple"
                value={expandedCommittees}
                onValueChange={setExpandedCommittees}
                className="space-y-4"
              >
                {selectedCommittees.map((committeeId) => {
                  const committee = committees.find(
                    (c) => c.id === committeeId
                  );
                  if (!committee) return null;

                  const assignedCourseIds = getCoursesForCommittee(committeeId);
                  const assignedCourses = curriculumCourses.filter((course) =>
                    assignedCourseIds.includes(course.id)
                  );

                  return (
                    <AccordionItem
                      key={committeeId}
                      value={String(committeeId)}
                      className="border rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">
                              {committee.first_name} {committee.last_name}
                            </h3>
                            <Badge variant="outline">
                              {assignedCourses.length} courses
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Assigned Courses</h4>
                            <div className="relative w-64">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                              <Input
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                              />
                            </div>
                          </div>

                          {/* Available courses for assignment */}
                          <div className="border rounded-md">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Course Code</TableHead>
                                  <TableHead>Course Title</TableHead>
                                  <TableHead>Year-Semester</TableHead>
                                  <TableHead className="text-right">
                                    Action
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredCourses.length === 0 ? (
                                  <TableRow>
                                    <TableCell
                                      colSpan={4}
                                      className="text-center py-6 text-muted-foreground"
                                    >
                                      No courses found matching your search.
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  filteredCourses.map((course) => {
                                    const isAssigned =
                                      assignedCourseIds.includes(course.id);
                                    const assignedToOther =
                                      !isAssigned &&
                                      getCommitteeForCourse(course.id) !== null;
                                    const yearSemester = yearSemesters.find(
                                      (ys) => ys.id === course.yearSemesterId
                                    );
                                    const semesterDisplay = yearSemester
                                      ? `Year ${yearSemester.year} - ${getSemesterName(yearSemester.semester)}`
                                      : "Unknown";

                                    return (
                                      <TableRow key={course.id}>
                                        <TableCell>{course.code}</TableCell>
                                        <TableCell>
                                          {course.descriptive_title}
                                        </TableCell>
                                        <TableCell>{semesterDisplay}</TableCell>
                                        <TableCell className="text-right">
                                          {isAssigned ? (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                removeCourseAssignment(
                                                  course.id
                                                )
                                              }
                                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                              Remove
                                            </Button>
                                          ) : assignedToOther ? (
                                            <Badge
                                              variant="outline"
                                              className="bg-amber-50 text-amber-800"
                                            >
                                              Assigned to{" "}
                                              {getCommitteeName(
                                                getCommitteeForCourse(
                                                  course.id
                                                )!
                                              )}
                                            </Badge>
                                          ) : (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                assignCourseToCommittee(
                                                  committeeId,
                                                  course.id
                                                )
                                              }
                                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            >
                                              Assign
                                            </Button>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </TabsContent>

          {/* Assign by Course View */}
          <TabsContent value="by-course" className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">All Curriculum Courses</h4>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Course list with committee assignment dropdown */}
            <div className="space-y-8">
              {yearSemesters.map((ys) => {
                const courses = groupedCourses[ys.id] || [];
                const filteredYearSemesterCourses = courses.filter(
                  (course) =>
                    course.code
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    course.descriptive_title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                );

                if (filteredYearSemesterCourses.length === 0) return null;

                return (
                  <div key={ys.id} className="space-y-4">
                    <h4 className="font-medium">
                      Year {ys.year} - {getSemesterName(ys.semester)}
                    </h4>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course Code</TableHead>
                            <TableHead>Course Title</TableHead>
                            <TableHead>Assigned Committee</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredYearSemesterCourses.map((course) => {
                            const assignedCommitteeId = getCommitteeForCourse(
                              course.id
                            );
                            const assignedCommittee = committees.find(
                              (c) => c.id === assignedCommitteeId
                            );

                            return (
                              <TableRow key={course.id}>
                                <TableCell>{course.code}</TableCell>
                                <TableCell>
                                  {course.descriptive_title}
                                </TableCell>
                                <TableCell>
                                  {assignedCommitteeId ? (
                                    <Badge className="bg-green-100 text-green-800">
                                      {assignedCommittee?.first_name}{" "}
                                      {assignedCommittee?.last_name}
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="bg-amber-50 text-amber-800"
                                    >
                                      Unassigned
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Select
                                    value={
                                      assignedCommitteeId
                                        ? String(assignedCommitteeId)
                                        : ""
                                    }
                                    onValueChange={(value) => {
                                      if (value === "unassigned") {
                                        removeCourseAssignment(course.id);
                                      } else {
                                        assignCourseToCommittee(
                                          Number(value),
                                          course.id
                                        );
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Select committee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unassigned">
                                        <span className="text-muted-foreground">
                                          -- Unassign --
                                        </span>
                                      </SelectItem>
                                      {selectedCommittees.map((committeeId) => {
                                        const committee = committees.find(
                                          (c) => c.id === committeeId
                                        );
                                        if (!committee) return null;
                                        return (
                                          <SelectItem
                                            key={committeeId}
                                            value={String(committeeId)}
                                          >
                                            {committee.first_name}{" "}
                                            {committee.last_name}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {unassignedCoursesCount > 0 && (
          <Alert
            variant="destructive"
            className="bg-amber-50 border-amber-200 text-amber-800"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              There are still {unassignedCoursesCount} unassigned courses.
              Please assign all courses to committees.
            </AlertDescription>
          </Alert>
        )}

        {selectedCommittees.length === 0 && (
          <Alert variant="destructive">
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              You need to select at least one committee before you can assign
              courses.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
