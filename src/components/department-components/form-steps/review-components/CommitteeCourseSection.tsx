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
  Committee,
  CurriculumCourse,
  YearSemester,
  CommitteeCourseAssignment,
} from "@/store/wizard-store";

interface CommitteeCourseAssignmentSectionProps {
  committees: Committee[];
  curriculumCourses: CurriculumCourse[];
  yearSemesters: YearSemester[];
  committeeCourseAssignments: CommitteeCourseAssignment[];
  goToStep: (step: number) => void;
}

export function CommitteeCourseAssignmentSection({
  committees,
  curriculumCourses,
  yearSemesters,
  committeeCourseAssignments,
  goToStep,
}: CommitteeCourseAssignmentSectionProps) {
  // Helper function to get semester name
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

  // Helper function to get committee name by ID
  const getCommitteeName = (committeeId: number) => {
    const committee = committees.find((c) => c.id === committeeId);
    return committee
      ? `${committee.first_name} ${committee.last_name}`
      : "Unassigned";
  };

  // Group curriculum courses by year-semester
  const groupedCourses: Record<string, CurriculumCourse[]> = {};
  yearSemesters.forEach((ys) => {
    groupedCourses[ys.id] = curriculumCourses.filter(
      (cc) => cc.yearSemesterId === ys.id
    );
  });

  // Find committee assigned to a course
  const findCommitteeForCourse = (courseId: number) => {
    const assignment = committeeCourseAssignments.find(
      (a) => a.courseId === courseId
    );
    return assignment ? assignment.committeeId : null;
  };

  return (
    <Section
      id="committee-course-assignment"
      title="Committee Course Assignments"
      stepNumber={15}
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
                    <TableHead>Assigned Committee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => {
                    const committeeId = findCommitteeForCourse(course.id);

                    return (
                      <TableRow key={course.id}>
                        <TableCell>{course.code}</TableCell>
                        <TableCell>{course.descriptive_title}</TableCell>
                        <TableCell>
                          {committeeId ? (
                            getCommitteeName(committeeId)
                          ) : (
                            <span className="text-amber-500">Unassigned</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
