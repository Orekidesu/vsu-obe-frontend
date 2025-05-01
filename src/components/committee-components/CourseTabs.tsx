import { AlertCircle, FileEdit, BookOpen, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "@/components/commons/card/CourseCard";
import useCurriculumCourses from "@/hooks/faculty-member/useCourseCurriculum";
import { useRouter } from "next/navigation";
// Define types for revision courses
export interface RevisionCourse {
  id: string;
  code: string;
  title: string;
  category: string;
  yearSemester: string;
  units: number;
  revisionReason: string;
}

export function CourseTabs() {
  const router = useRouter();

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

  const revisionCourses: RevisionCourse[] = [
    {
      id: "r1",
      code: "CSCI 301",
      title: "Data Structures and Algorithms",
      category: "Core Courses",
      yearSemester: "Year 2 - First Semester",
      units: 3,
      revisionReason:
        "Update learning outcomes to match new curriculum standards",
    },
  ];

  // Handlers for course actions
  // In your CourseTabs.tsx where the "Add Details" button is clicked
  const handleAddDetails = (courseId: string) => {
    router.push(`/faculty/courses/course-details/${courseId}`);
  };

  const handleRevise = (courseId: string) => {
    console.log(`Revise course ${courseId}`);
    // In a real app, you would navigate to a form or open a modal
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Assigned Courses Dashboard</h2>
      </div>

      <Tabs defaultValue="pending" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-8 sticky">
          <TabsTrigger value="pending">Pending Details</TabsTrigger>
          <TabsTrigger value="revision">Needs Revision</TabsTrigger>
        </TabsList>

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
          ) : !curriculumCourses || curriculumCourses.length === 0 ? (
            <div className="text-center p-10 border rounded-lg bg-muted/50">
              <BookOpen className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Pending Courses</h3>
              <p className="text-muted-foreground">
                You do not have any courses that need details to be added.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {curriculumCourses.map((course) => (
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

        <TabsContent value="revision">
          <div className="flex items-center gap-2 mb-6">
            <FileEdit className="h-6 w-6 text-red-500" />
            <h3 className="text-xl font-semibold">Courses Needing Revision</h3>
          </div>

          {revisionCourses.length === 0 ? (
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
                  key={course.id}
                  id={course.id}
                  code={course.code}
                  title={course.title}
                  category={course.category}
                  yearSemester={course.yearSemester}
                  units={course.units}
                  status="revision"
                  revisionReason={course.revisionReason}
                  actionText="Revise Course"
                  actionVariant="destructive"
                  onAction={() => handleRevise(course.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
