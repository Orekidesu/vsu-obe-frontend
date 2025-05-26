import { AlertCircle, Check, FileEdit, BookOpen, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "@/components/commons/card/CourseCard";
import useCurriculumCourses from "@/hooks/faculty-member/useCourseCurriculum";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
// import { useState } from "react";

export function CourseTabs() {
  const router = useRouter();
  // const [activeTab, setActiveTab] = useState("completed");

  // Fetch curriculum courses from API
  const { curriculumCourses, isLoading, error } = useCurriculumCourses();

  // Format semester for display
  const formatSemester = (year: number, sem: string): string => {
    const semesterName =
      sem === "first"
        ? "First Semester"
        : sem === "second"
          ? "Second Semester"
          : sem === "midyear"
            ? "Midyear"
            : sem;

    return `Year ${year} - ${semesterName}`;
  };

  // Filter courses by status
  const completedCourses =
    curriculumCourses?.filter((course) => course.is_completed) || [];

  const pendingCourses =
    curriculumCourses?.filter(
      (course) => !course.is_completed && !course.is_in_revision
    ) || [];

  const revisionCourses =
    curriculumCourses?.filter((course) => course.is_in_revision) || [];

  // Handlers for course actions
  const handleAddDetails = (courseId: string) => {
    router.push(`/faculty/all-courses/${courseId}`);
  };

  const handleRevise = (courseId: string) => {
    router.push(`/faculty/course-details/${courseId}/edit-details`);
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Assigned Courses Dashboard</h2>
      </div>

      <Tabs
        defaultValue="completed"
        className="mb-8"
        // onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full grid-cols-3 mb-8 sticky">
          <TabsTrigger className="flex items-center gap-2" value="completed">
            Completed
            <Badge variant="outline">{completedCourses.length}</Badge>
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="pending">
            Pending Details
            <Badge variant="outline">{pendingCourses.length}</Badge>
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="revision">
            Needs Revision
            <Badge variant="outline">{revisionCourses.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Completed Courses */}
        <TabsContent value="completed">
          <div className="flex items-center gap-2 mb-6">
            <Check className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold">Completed Courses</h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading courses...</span>
            </div>
          ) : error ? (
            <div className="text-center p-10 border rounded-lg bg-red-50">
              <AlertCircle className="h-10 w-10 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-medium mb-2">
                Error Loading Courses
              </h3>
              <p className="text-muted-foreground">
                There was a problem loading your courses. Please try again.
              </p>
            </div>
          ) : completedCourses.length === 0 ? (
            <div className="text-center p-10 border rounded-lg bg-muted/50">
              <BookOpen className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Completed Courses</h3>
              <p className="text-muted-foreground">
                You don&apos;t have any courses that have been completed yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedCourses.map((course) => (
                <CourseCard
                  key={course.id.toString()}
                  id={course.id.toString()}
                  code={course.course.code}
                  title={course.course.descriptive_title}
                  category={course.course_category.name}
                  yearSemester={formatSemester(
                    course.semester.year,
                    course.semester.sem
                  )}
                  units={Number(course.units)}
                  status="completed"
                  actionText="View Details"
                  onAction={() => handleAddDetails(course.id.toString())}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending Courses */}
        <TabsContent value="pending">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <h3 className="text-xl font-semibold">Courses Pending Details</h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading courses...</span>
            </div>
          ) : error ? (
            <div className="text-center p-10 border rounded-lg bg-red-50">
              <AlertCircle className="h-10 w-10 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-medium mb-2">
                Error Loading Courses
              </h3>
              <p className="text-muted-foreground">
                There was a problem loading your courses. Please try again.
              </p>
            </div>
          ) : pendingCourses.length === 0 ? (
            <div className="text-center p-10 border rounded-lg bg-muted/50">
              <BookOpen className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Pending Courses</h3>
              <p className="text-muted-foreground">
                You do not have any courses that need details to be added.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCourses.map((course) => (
                <CourseCard
                  key={course.id.toString()}
                  id={course.id.toString()}
                  code={course.course.code}
                  title={course.course.descriptive_title}
                  category={course.course_category.name}
                  yearSemester={formatSemester(
                    course.semester.year,
                    course.semester.sem
                  )}
                  units={Number(course.units)}
                  status="pending"
                  actionText="Add Details"
                  onAction={() => handleAddDetails(course.id.toString())}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Courses That Needs Revision */}
        <TabsContent value="revision">
          <div className="flex items-center gap-2 mb-6">
            <FileEdit className="h-6 w-6 text-red-500" />
            <h3 className="text-xl font-semibold">Courses Needing Revision</h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading courses...</span>
            </div>
          ) : error ? (
            <div className="text-center p-10 border rounded-lg bg-red-50">
              <AlertCircle className="h-10 w-10 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-medium mb-2">
                Error Loading Courses
              </h3>
              <p className="text-muted-foreground">
                There was a problem loading your courses. Please try again.
              </p>
            </div>
          ) : revisionCourses.length === 0 ? (
            <div className="text-center p-10 border rounded-lg bg-muted/50">
              <BookOpen className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                No Courses Need Revision
              </h3>
              <p className="text-muted-foreground">
                You do not have any courses that need to be revised.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {revisionCourses.map((course) => (
                <CourseCard
                  key={course.id.toString()}
                  id={course.id.toString()}
                  code={course.course.code}
                  title={course.course.descriptive_title}
                  category={course.course_category.name}
                  yearSemester={formatSemester(
                    course.semester.year,
                    course.semester.sem
                  )}
                  units={Number(course.units)}
                  status="revision"
                  actionText="Revise Course"
                  actionVariant="default"
                  onAction={() => handleRevise(course.id.toString())}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
