import { AlertCircle, FileEdit, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "@/components/commons/card/CourseCard";
import { useState } from "react";

// Define types for the course data
export interface CourseBase {
  id: string;
  code: string;
  title: string;
  category: string;
  yearSemester: string;
  units: number;
}

export type PendingCourse = CourseBase;

export interface RevisionCourse extends CourseBase {
  revisionReason: string;
}

export function CourseTabs() {
  // Dummy data for pending courses
  const [pendingCourses] = useState<PendingCourse[]>([
    {
      id: "p1",
      code: "CSCI 101",
      title: "Introduction to Computer Science",
      category: "Core Courses",
      yearSemester: "Year 1 - First Semester",
      units: 3,
    },
  ]);

  // Dummy data for courses needing revision
  const [revisionCourses] = useState<RevisionCourse[]>([
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
  ]);

  // Handlers for course actions
  const handleAddDetails = (courseId: string) => {
    console.log(`Add details for course ${courseId}`);
    // In a real app, you would navigate to a form or open a modal
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

          {pendingCourses.length === 0 ? (
            <div className="text-center p-10 border rounded-lg bg-muted/50">
              <BookOpen className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Pending Courses</h3>
              <p className="text-muted-foreground">
                You don not have any courses that need details to be added.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  code={course.code}
                  title={course.title}
                  category={course.category}
                  yearSemester={course.yearSemester}
                  units={course.units}
                  status="pending"
                  actionText="Add Details"
                  onAction={() => handleAddDetails(course.id)}
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
                You don not have any courses that need to be revised.
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
