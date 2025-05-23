import { Section } from "./Section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  YearSemester,
  CourseCategory,
  CurriculumCourse,
} from "@/store/wizard-store";

interface CurriculumCoursesSectionProps {
  yearSemesters: YearSemester[];
  courseCategories: CourseCategory[];
  curriculumCourses: CurriculumCourse[];
  goToStep: (step: number) => void;
}

export function CurriculumCoursesSection({
  yearSemesters,
  courseCategories,
  curriculumCourses,
  goToStep,
}: CurriculumCoursesSectionProps) {
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

  // Group curriculum courses by year-semester
  const groupedCourses: Record<string, CurriculumCourse[]> = {};
  yearSemesters.forEach((ys) => {
    groupedCourses[ys.id] = curriculumCourses.filter(
      (cc) => cc.yearSemesterId === ys.id
    );
  });

  return (
    <Section
      id="curriculum-courses"
      title="Curriculum Courses"
      stepNumber={12}
      goToStep={goToStep}
    >
      <div className="space-y-8">
        {yearSemesters.map((ys) => {
          const courses = groupedCourses[ys.id] || [];
          if (courses.length === 0) return null;

          return (
            <div key={ys.id} className="space-y-4">
              <h4 className="font-medium">
                Year {ys.year} - {getSemesterName(ys.semester)}
              </h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Units</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={`${course.id}-${course.yearSemesterId}`}>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.descriptive_title}</TableCell>
                      <TableCell>
                        {courseCategories.find(
                          (category) =>
                            category.id.toString() === course.categoryId
                        )?.name || "Unknown"}{" "}
                        (
                        {courseCategories.find(
                          (category) =>
                            category.id.toString() === course.categoryId
                        )?.code || "?"}
                        )
                      </TableCell>
                      <TableCell>{course.units}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
