import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Committee {
  id: string;
  name: string;
  description: string;
}

interface CommitteeAssignment {
  committeeId: string;
  courseId: string;
}

interface Course {
  code: string;
  descriptive_title: string;
}

interface CommitteeAssignmentsProps {
  committees: Committee[];
  committeeAssignments: CommitteeAssignment[];
  courses: Course[];
}

export function CommitteeAssignments({
  committees,
  committeeAssignments,
  courses,
}: CommitteeAssignmentsProps) {
  // Helper function to get course details by ID
  const getCourseById = (courseId: string) => {
    return courses.find((course) => course.code === courseId);
  };

  // Helper function to get courses assigned to a committee
  const getCoursesForCommittee = (committeeId: string) => {
    return committeeAssignments
      .filter((assignment) => assignment.committeeId === committeeId)
      .map((assignment) => assignment.courseId);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Committee Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-4">
            {committees.map((committee) => {
              const assignedCourseIds = getCoursesForCommittee(committee.id);
              return (
                <AccordionItem
                  key={committee.id}
                  value={committee.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-medium">{committee.name}</h3>
                      <Badge className="ml-2">
                        {assignedCourseIds.length} courses
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <p className="text-muted-foreground mb-4">
                      {committee.description}
                    </p>

                    {assignedCourseIds.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {assignedCourseIds.map((courseId) => {
                          const course = getCourseById(courseId);
                          return (
                            <Card key={courseId} className="border">
                              <CardContent className="p-4">
                                <h4 className="font-medium">{courseId}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {course?.descriptive_title || "Unknown"}
                                </p>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No courses assigned to this committee.
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
                    <h3 className="text-xl font-medium">Unassigned Courses</h3>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Committee Workload Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {committees.map((committee) => {
              const assignedCourseIds = getCoursesForCommittee(committee.id);
              const percentage =
                (assignedCourseIds.length / courses.length) * 100;

              return (
                <div key={committee.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{committee.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {assignedCourseIds.length} courses (
                      {percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
