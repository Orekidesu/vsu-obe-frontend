import { create } from "zustand";

export interface CourseOutcome {
  id: number;
  name: string;
  statement: string;
  abcd: {
    audience: string;
    behavior: string;
    condition: string;
    degree: string;
  };
  cpa: string;
  po_mappings: Array<{
    po_id: number;
    po_name: string;
    po_statement: string;
    ied: string;
  }>;
  tla_tasks: Array<{
    id: number;
    at_code: string;
    at_name: string;
    at_tool: string;
    weight: string;
  }>;
  tla_assessment_method: {
    id: number;
    teaching_methods: string[];
    learning_resources: string[];
  };
}

export interface CurriculumCourse {
  id: number;
  curriculum: {
    id: number;
    name: string;
  };
  course: {
    id: number;
    code: string;
    descriptive_title: string;
  };
  course_category: {
    id: number;
    name: string;
    code: string;
  };
  semester: {
    id: number;
    year: number;
    sem: string;
  };
  units: string;
  is_in_revision: boolean;
  is_completed: boolean;
  course_outcomes: CourseOutcome[];
}

interface CourseRevisionState {
  // Current course data
  currentCourse: CurriculumCourse | null;

  // Modified sections tracking
  modifiedSections: Set<string>;

  // Course outcomes
  courseOutcomes: CourseOutcome[];

  // ===========Actions========== //

  // Course Outcome actions
  setCurrentCourse: (course: CurriculumCourse) => void;
  setCourseOutcomes: (outcomes: CourseOutcome[]) => void;
  addCourseOutcome: (outcome: Omit<CourseOutcome, "id">) => void;
  updateCourseOutcome: (id: number, outcome: Partial<CourseOutcome>) => void;
  removeCourseOutcome: (id: number) => void;

  markSectionAsModified: (section: string) => void;
  resetStore: () => void;
  resetCourseOutcomes: () => void;
}

export const useCourseRevisionStore = create<CourseRevisionState>(
  (set, get) => ({
    currentCourse: null,
    modifiedSections: new Set(),
    courseOutcomes: [],

    setCurrentCourse: (course) => {
      set({
        currentCourse: course,
        courseOutcomes: course.course_outcomes || [],
      });
    },

    setCourseOutcomes: (outcomes) => {
      set({ courseOutcomes: outcomes });
      get().markSectionAsModified("course_outcomes");
    },

    addCourseOutcome: (outcome) => {
      const newId = Math.max(...get().courseOutcomes.map((co) => co.id), 0) + 1;
      const newOutcome: CourseOutcome = {
        ...outcome,
        id: newId,
      };

      set((state) => ({
        courseOutcomes: [...state.courseOutcomes, newOutcome],
      }));
      get().markSectionAsModified("course_outcomes");
    },

    updateCourseOutcome: (id, updates) => {
      set((state) => ({
        courseOutcomes: state.courseOutcomes.map((outcome) =>
          outcome.id === id ? { ...outcome, ...updates } : outcome
        ),
      }));
      get().markSectionAsModified("course_outcomes");
    },

    removeCourseOutcome: (id) => {
      set((state) => ({
        courseOutcomes: state.courseOutcomes.filter(
          (outcome) => outcome.id !== id
        ),
      }));
      get().markSectionAsModified("course_outcomes");
    },

    markSectionAsModified: (section) => {
      set((state) => ({
        modifiedSections: new Set([...state.modifiedSections, section]),
      }));
    },

    resetStore: () => {
      set({
        currentCourse: null,
        modifiedSections: new Set(),
        courseOutcomes: [],
      });
    },
    // Reset Course Outcome
    resetCourseOutcomes: () => {
      const { currentCourse } = get();
      if (currentCourse) {
        set({
          courseOutcomes: currentCourse.course_outcomes || [],
        });
        // Remove the section from modified sections
        const modifiedSections = new Set(get().modifiedSections);
        modifiedSections.delete("course_outcomes");
        set({ modifiedSections });
      }
    },
  })
);
