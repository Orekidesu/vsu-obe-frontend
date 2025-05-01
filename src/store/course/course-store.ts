import { create } from "zustand";

// Define the Course Outcome interface
export interface CourseOutcome {
  id: number;
  name: string;
  statement: string;
}

// Define the Course Details state
interface CourseDetailsState {
  // Course identification
  courseId: string;
  courseCode: string;
  courseTitle: string;

  // Course outcomes
  courseOutcomes: CourseOutcome[];

  // Actions
  setCourseInfo: (
    courseId: string,
    courseCode: string,
    courseTitle: string
  ) => void;
  addCourseOutcome: () => void;
  updateCourseOutcome: (id: number, name: string, statement: string) => void;
  removeCourseOutcome: (id: number) => void;
}

export const useCourseDetailsStore = create<CourseDetailsState>((set) => ({
  // Initial state
  courseId: "",
  courseCode: "",
  courseTitle: "",
  courseOutcomes: [{ id: 1, name: "", statement: "" }], // Start with one empty outcome

  // Actions
  setCourseInfo: (courseId, courseCode, courseTitle) =>
    set({ courseId, courseCode, courseTitle }),

  addCourseOutcome: () =>
    set((state) => {
      const newId =
        state.courseOutcomes.length > 0
          ? Math.max(...state.courseOutcomes.map((outcome) => outcome.id)) + 1
          : 1;
      return {
        courseOutcomes: [
          ...state.courseOutcomes,
          { id: newId, name: "", statement: "" },
        ],
      };
    }),

  updateCourseOutcome: (id, name, statement) =>
    set((state) => ({
      courseOutcomes: state.courseOutcomes.map((outcome) =>
        outcome.id === id ? { ...outcome, name, statement } : outcome
      ),
    })),

  removeCourseOutcome: (id) =>
    set((state) => ({
      courseOutcomes: state.courseOutcomes.filter(
        (outcome) => outcome.id !== id
      ),
    })),
}));
