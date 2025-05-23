import {
  Table,
  TableBody,
  // TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course } from "@/types/model/Course";
import {
  CourseCategory,
  CurriculumCourse,
  EditCourseFormData,
  SemesterData,
} from "./types";
import { CourseTableRow } from "./CourseTableRow";
import { EditCourseRow } from "./EditCourseRow";

interface CurriculumTableProps {
  availableSemesters: SemesterData[];
  sortedSemesters: SemesterData[];
  coursesBySemester: Record<number, CurriculumCourse[]>;
  isEditingCourse: number | string | null;
  editCourse: EditCourseFormData;
  setEditCourse: (course: EditCourseFormData) => void;
  courseCategories: CourseCategory[];
  getCourseDetails: (courseId: number) => Course | undefined;
  // Update these functions to accept string IDs
  getCategoryDetails: (
    categoryId: number | string
  ) => CourseCategory | undefined;
  getSemesterDetails: (semesterId: number) => SemesterData | undefined;
  handleCategoryChange: (categoryId: string, isNewCourse: boolean) => void;
  handleStartEdit: (id: number | string) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleDeleteCourse: (id: number | string) => void;
}

export function CurriculumTable({
  availableSemesters,
  coursesBySemester,
  sortedSemesters,
  isEditingCourse,
  editCourse,
  setEditCourse,
  courseCategories,
  getCourseDetails,
  getCategoryDetails,
  getSemesterDetails,
  handleCategoryChange,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleDeleteCourse,
}: CurriculumTableProps) {
  if (Object.keys(coursesBySemester).length === 0) {
    return (
      <div className="text-center p-6 border rounded-md bg-muted/20">
        <p>
          No courses added to the curriculum yet. Use the form above to add
          courses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {availableSemesters.map((semester) => {
        const courses = coursesBySemester[semester.id] || [];
        if (courses.length === 0) return null;

        return (
          <div key={semester.id} className="space-y-4">
            <h3 className="text-xl font-semibold">
              Year {semester.year} -{" "}
              {semester.sem.charAt(0).toUpperCase() + semester.sem.slice(1)}{" "}
              Semester
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead className="w-[200px]">Category</TableHead>
                  {isEditingCourse !== null && (
                    <TableHead className="w-[200px]">Year/Semester</TableHead>
                  )}
                  {/* Add this column */}
                  <TableHead className="w-[80px]">Units</TableHead>
                  <TableHead className="w-[120px] text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => {
                  const courseDetails = getCourseDetails(course.course_id);
                  const categoryDetails = getCategoryDetails(
                    course.course_category_id
                  );

                  return isEditingCourse === course.id ? (
                    <EditCourseRow
                      key={course.id}
                      courseDetails={courseDetails}
                      courseCategories={courseCategories}
                      sortedSemesters={sortedSemesters}
                      editCourse={editCourse}
                      setEditCourse={setEditCourse}
                      handleCategoryChange={handleCategoryChange}
                      handleSaveEdit={handleSaveEdit}
                      handleCancelEdit={handleCancelEdit}
                      showSemesterColumn={true}
                    />
                  ) : (
                    <CourseTableRow
                      key={course.id}
                      course={course}
                      courseDetails={courseDetails}
                      categoryDetails={categoryDetails}
                      semesterDetails={getSemesterDetails(course.semester_id)}
                      handleStartEdit={handleStartEdit}
                      handleDeleteCourse={handleDeleteCourse}
                      showSemesterColumn={isEditingCourse !== null}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
}
