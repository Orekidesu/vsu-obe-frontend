import { create } from "zustand";

// Define the Course Outcome interface
export interface CourseOutcome {
  id: number;
  name: string;
  statement: string;
}

// Define the CO_ABCD mapping interface
export interface CO_ABCD_Mapping {
  co_id: number;
  audience: string;
  behavior: string;
  condition: string;
  degree: string;
}

// Define the CO_CPA mapping interface
export interface CO_CPA_Mapping {
  courseOutcomeId: number;
  domain: "cognitive" | "psychomotor" | "affective" | null;
}

// Define the Course Details state
interface CourseDetailsState {
  // Course identification
  courseId: string;
  courseCode: string;
  courseTitle: string;

  // Current step
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Course outcomes
  courseOutcomes: CourseOutcome[];

  // ABCD mappings
  coAbcdMappings: CO_ABCD_Mapping[];

  // CPA mappings
  coCpaMappings: CO_CPA_Mapping[];

  // Actions
  setCourseInfo: (
    courseId: string,
    courseCode: string,
    courseTitle: string
  ) => void;
  addCourseOutcome: () => void;
  updateCourseOutcome: (id: number, name: string, statement: string) => void;
  removeCourseOutcome: (id: number) => void;

  // ABCD model actions
  updateCourseOutcomeABCD: (
    co_id: number,
    audience: string,
    behavior: string,
    condition: string,
    degree: string
  ) => void;
  getABCDMappingForCO: (co_id: number) => CO_ABCD_Mapping | undefined;

  // CPA classification actions
  updateCourseOutcomeCPA: (
    courseOutcomeId: number,
    domain: "cognitive" | "psychomotor" | "affective" | null
  ) => void;
  getCPAMappingForCO: (courseOutcomeId: number) => CO_CPA_Mapping | undefined;
}

export const useCourseDetailsStore = create<CourseDetailsState>((set, get) => ({
  // Initial state
  courseId: "",
  courseCode: "",
  courseTitle: "",
  currentStep: 1,
  courseOutcomes: [{ id: 1, name: "", statement: "" }], // Start with one empty outcome
  coAbcdMappings: [], // Start with empty mappings
  coCpaMappings: [], // Start with empty CPA mappings

  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),

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
    set((state) => {
      // Remove the outcome
      const updatedOutcomes = state.courseOutcomes.filter(
        (outcome) => outcome.id !== id
      );

      // Also remove any ABCD mappings for this outcome
      const updatedABCDMappings = state.coAbcdMappings.filter(
        (mapping) => mapping.co_id !== id
      );

      // Also remove any CPA mappings for this outcome
      const updatedCPAMappings = state.coCpaMappings.filter(
        (mapping) => mapping.courseOutcomeId !== id
      );

      return {
        courseOutcomes: updatedOutcomes,
        coAbcdMappings: updatedABCDMappings,
        coCpaMappings: updatedCPAMappings,
      };
    }),

  updateCourseOutcomeABCD: (co_id, audience, behavior, condition, degree) =>
    set((state) => {
      // Check if a mapping already exists for this outcome
      const existingMappingIndex = state.coAbcdMappings.findIndex(
        (mapping) => mapping.co_id === co_id
      );

      let updatedMappings;

      if (existingMappingIndex >= 0) {
        // Update existing mapping
        updatedMappings = [...state.coAbcdMappings];
        updatedMappings[existingMappingIndex] = {
          co_id,
          audience,
          behavior,
          condition,
          degree,
        };
      } else {
        // Create new mapping
        updatedMappings = [
          ...state.coAbcdMappings,
          {
            co_id,
            audience,
            behavior,
            condition,
            degree,
          },
        ];
      }

      return { coAbcdMappings: updatedMappings };
    }),

  getABCDMappingForCO: (courseOutcomeId) => {
    const state = get();
    return state.coAbcdMappings.find(
      (mapping) => mapping.co_id === courseOutcomeId
    );
  },
  updateCourseOutcomeCPA: (courseOutcomeId, domain) =>
    set((state) => {
      // Check if a mapping already exists for this outcome
      const existingMappingIndex = state.coCpaMappings.findIndex(
        (mapping) => mapping.courseOutcomeId === courseOutcomeId
      );

      let updatedMappings;

      if (existingMappingIndex >= 0) {
        // Update existing mapping
        updatedMappings = [...state.coCpaMappings];
        updatedMappings[existingMappingIndex] = {
          courseOutcomeId,
          domain,
        };
      } else {
        // Create new mapping
        updatedMappings = [
          ...state.coCpaMappings,
          {
            courseOutcomeId,
            domain,
          },
        ];
      }

      return { coCpaMappings: updatedMappings };
    }),

  getCPAMappingForCO: (courseOutcomeId) => {
    const state = get();
    return state.coCpaMappings.find(
      (mapping) => mapping.courseOutcomeId === courseOutcomeId
    );
  },
}));
