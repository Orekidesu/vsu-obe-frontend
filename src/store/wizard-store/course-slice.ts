import { StateCreator } from "zustand";
import { WizardState, CurriculumCourse } from "./types";

export const createCourseSlice: StateCreator<
  WizardState,
  [],
  [],
  Pick<
    WizardState,
    | "courseCategories"
    | "premadeCourses"
    | "curriculumCourses"
    | "courseToPOMappings"
    | "addCourseCategory"
    | "updateCourseCategory"
    | "removeCourseCategory"
    | "addCourse"
    | "addCurriculumCourse"
    | "updateCurriculumCourse"
    | "removeCurriculumCourse"
    | "updateCourseToPOMapping"
    | "removeCourseToPOMapping"
  >
> = (set) => ({
  courseCategories: [{ id: 15, name: "Common Courses", code: "CC" }],
  premadeCourses: [
    { id: "csit101", code: "CSIT 101", title: "Introduction to Computing" },
    { id: "csit102", code: "CSIT 102", title: "Computer Programming 1" },
    { id: "csit103", code: "CSIT 103", title: "Computer Programming 2" },
    { id: "math101", code: "MATH 101", title: "College Algebra" },
    { id: "math102", code: "MATH 102", title: "Trigonometry" },
    { id: "engl101", code: "ENGL 101", title: "Communication Skills 1" },
    { id: "engl102", code: "ENGL 102", title: "Communication Skills 2" },
    { id: "phys101", code: "PHYS 101", title: "General Physics 1" },
    { id: "phys102", code: "PHYS 102", title: "General Physics 2" },
    { id: "chem101", code: "CHEM 101", title: "General Chemistry" },
  ],
  curriculumCourses: [],
  courseToPOMappings: [],

  addCourseCategory: (name, code) =>
    set((state) => {
      // Create a unique ID based on the code (lowercase for consistency)
      const id =
        state.courseCategories.length > 0
          ? Math.max(...state.courseCategories.map((cc) => cc.id)) + 1
          : 1;

      // Check if this code already exists
      const exists = state.courseCategories.some(
        (cc) => cc.code.toLowerCase() === code.toLowerCase()
      );
      if (exists) {
        return state; // Don't add duplicates
      }

      // Add the new course category
      return {
        courseCategories: [...state.courseCategories, { id, name, code }].sort(
          (a, b) => a.name.localeCompare(b.name)
        ),
      };
    }),

  updateCourseCategory: (id: number, name: string, code: string) =>
    set((state) => {
      // Check if the new code already exists (except for the current category)

      const codeExists = state.courseCategories.some(
        (cc) => cc.id !== id && cc.code.toLowerCase() === code.toLowerCase()
      );
      if (codeExists) {
        return state; // Don't update if code already exists
      }

      // Update curriculum courses that use this category
      const updatedCurriculumCourses = state.curriculumCourses.map((cc) =>
        cc.categoryId === id.toString()
          ? { ...cc, categoryId: id.toString() }
          : cc
      );

      // Update the course category
      return {
        courseCategories: state.courseCategories
          .map((cc) => (cc.id === id ? { id, name, code } : cc))
          .sort((a, b) => a.name.localeCompare(b.name)),
        curriculumCourses: updatedCurriculumCourses,
      };
    }),

  removeCourseCategory: (id: number) =>
    set((state) => {
      // Remove any curriculum courses associated with this category
      const updatedCurriculumCourses = state.curriculumCourses.filter(
        (cc) => cc.categoryId !== id.toString()
      );

      // Get the IDs of removed curriculum courses
      const removedCourseIds = state.curriculumCourses
        .filter((cc) => cc.categoryId === id.toString())
        .map((cc) => cc.id);

      // Remove any course to PO mappings associated with removed courses
      const updatedCourseToPOMappings = state.courseToPOMappings.filter(
        (mapping) => !removedCourseIds.includes(mapping.courseId)
      );

      return {
        courseCategories: state.courseCategories.filter((cc) => cc.id !== id),
        curriculumCourses: updatedCurriculumCourses,
        courseToPOMappings: updatedCourseToPOMappings,
      };
    }),

  addCourse: (code, title) => {
    const id = code.toLowerCase().replace(/\s+/g, ""); // Create a unique ID based on the code

    set((state) => {
      // Check if this course already exists in premade courses
      const existingPremadeCourse = state.premadeCourses.find(
        (c) => c.id === id
      );
      if (existingPremadeCourse) {
        return state; // Don't add duplicates
      }

      // Add the new course to premade courses
      const updatedPremadeCourses = [
        ...state.premadeCourses,
        { id, code, title },
      ].sort((a, b) => a.code.localeCompare(b.code));

      return {
        premadeCourses: updatedPremadeCourses,
      };
    });

    return id; // Return the ID of the newly added course
  },

  addCurriculumCourse: (courseId, categoryId, yearSemesterId, units) =>
    set((state) => {
      // Find the course from premade courses
      const course = state.premadeCourses.find((c) => c.id === courseId);
      if (!course) {
        return state; // Course not found
      }

      // Check if this course is already in the curriculum for this year-semester
      const exists = state.curriculumCourses.some(
        (cc) => cc.id === courseId && cc.yearSemesterId === yearSemesterId
      );
      if (exists) {
        return state; // Don't add duplicates
      }

      // Add the new curriculum course
      const newCurriculumCourse: CurriculumCourse = {
        ...course,
        categoryId,
        yearSemesterId,
        units,
      };

      return {
        curriculumCourses: [
          ...state.curriculumCourses,
          newCurriculumCourse,
        ].sort((a, b) => {
          // Sort by year-semester first
          const yearSemesterA = state.yearSemesters.find(
            (ys) => ys.id === a.yearSemesterId
          );
          const yearSemesterB = state.yearSemesters.find(
            (ys) => ys.id === b.yearSemesterId
          );

          if (yearSemesterA && yearSemesterB) {
            if (yearSemesterA.year !== yearSemesterB.year) {
              return yearSemesterA.year - yearSemesterB.year;
            }

            const semesterOrder = { first: 0, second: 1, midyear: 2 };
            const semesterCompare =
              semesterOrder[
                yearSemesterA.semester as keyof typeof semesterOrder
              ] -
              semesterOrder[
                yearSemesterB.semester as keyof typeof semesterOrder
              ];

            if (semesterCompare !== 0) {
              return semesterCompare;
            }
          }

          // Then sort by course code
          return a.code.localeCompare(b.code);
        }),
      };
    }),

  updateCurriculumCourse: (id, categoryId, yearSemesterId, units) =>
    set((state) => ({
      curriculumCourses: state.curriculumCourses.map((cc) =>
        cc.id === id ? { ...cc, categoryId, yearSemesterId, units } : cc
      ),
    })),

  removeCurriculumCourse: (id) =>
    set((state) => ({
      curriculumCourses: state.curriculumCourses.filter((cc) => cc.id !== id),
      // Also remove any course to PO mappings for this course
      courseToPOMappings: state.courseToPOMappings.filter(
        (mapping) => mapping.courseId !== id
      ),
    })),

  updateCourseToPOMapping: (courseId, poId, contributionLevels) =>
    set((state) => {
      // Check if this mapping already exists
      const existingMapping = state.courseToPOMappings.find(
        (mapping) => mapping.courseId === courseId && mapping.poId === poId
      );

      if (existingMapping) {
        // If the contribution levels array is empty, remove the mapping
        if (contributionLevels.length === 0) {
          return {
            courseToPOMappings: state.courseToPOMappings.filter(
              (mapping) =>
                !(mapping.courseId === courseId && mapping.poId === poId)
            ),
          };
        }

        // Update the existing mapping
        return {
          courseToPOMappings: state.courseToPOMappings.map((mapping) =>
            mapping.courseId === courseId && mapping.poId === poId
              ? { ...mapping, contributionLevels }
              : mapping
          ),
        };
      } else {
        // Only add the mapping if there are contribution levels
        if (contributionLevels.length === 0) {
          return state;
        }

        // Add a new mapping
        return {
          courseToPOMappings: [
            ...state.courseToPOMappings,
            { courseId, poId, contributionLevels },
          ],
        };
      }
    }),

  removeCourseToPOMapping: (courseId, poId) =>
    set((state) => ({
      courseToPOMappings: state.courseToPOMappings.filter(
        (mapping) => !(mapping.courseId === courseId && mapping.poId === poId)
      ),
    })),
});
