import { StateCreator } from "zustand";
import { WizardState } from "./types";

export const createCurriculumSlice: StateCreator<
  WizardState,
  [],
  [],
  Pick<
    WizardState,
    | "curriculumName"
    | "academicYear"
    | "yearSemesters"
    | "setCurriculumName"
    | "setAcademicYear"
    | "setYearSemesters"
    | "addYearSemester"
    | "removeYearSemester"
  >
> = (set) => ({
  curriculumName: "",
  academicYear: "",
  yearSemesters: [],

  setCurriculumName: (name) => set({ curriculumName: name }),
  setAcademicYear: (year) => set({ academicYear: year }),
  setYearSemesters: (yearSemesters) => set({ yearSemesters }),

  addYearSemester: (year, semester) =>
    set((state) => {
      // Create a unique ID for this year-semester combination
      const id = `${year}-${semester}`;

      // Check if this combination already exists
      const exists = state.yearSemesters.some((ys) => ys.id === id);
      if (exists) {
        return state; // Don't add duplicates
      }

      // Add the new year-semester combination
      return {
        yearSemesters: [...state.yearSemesters, { id, year, semester }].sort(
          (a, b) => {
            // Sort by year first
            if (a.year !== b.year) {
              return a.year - b.year;
            }

            // Then sort by semester (first, second, midyear)
            const semesterOrder = { first: 0, second: 1, midyear: 2 };
            return (
              semesterOrder[a.semester as keyof typeof semesterOrder] -
              semesterOrder[b.semester as keyof typeof semesterOrder]
            );
          }
        ),
      };
    }),

  removeYearSemester: (id) =>
    set((state) => {
      // Remove any curriculum courses associated with this year-semester
      const updatedCurriculumCourses = state.curriculumCourses.filter(
        (cc) => cc.yearSemesterId !== id
      );

      // Get the IDs of removed curriculum courses
      const removedCourseIds = state.curriculumCourses
        .filter((cc) => cc.yearSemesterId === id)
        .map((cc) => cc.id);

      // Remove any course to PO mappings associated with removed courses
      const updatedCourseToPOMappings = state.courseToPOMappings.filter(
        (mapping) => !removedCourseIds.includes(mapping.courseId)
      );

      // Remove any committee course assignments associated with removed courses
      const updatedCommitteeCourseAssignments =
        state.committeeCourseAssignments.filter(
          (assignment) => !removedCourseIds.includes(assignment.courseId)
        );
      return {
        yearSemesters: state.yearSemesters.filter((ys) => ys.id !== id),
        curriculumCourses: updatedCurriculumCourses,
        courseToPOMappings: updatedCourseToPOMappings,
        committeeCourseAssignments: updatedCommitteeCourseAssignments,
      };
    }),
});
