import { create } from "zustand";

export interface CourseOutcome {
  id: number | null;
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
    po_name?: string;
    po_statement?: string;
    ied: string;
  }>;
  tla_tasks: Array<{
    id?: number;
    at_code: string;
    at_name: string;
    at_tool: string;
    weight: string;
  }>;
  tla_assessment_method: {
    id?: number;
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

// Payload interface for submission
export interface CourseOutcomeSubmissionPayload {
  course_outcomes: Array<{
    id: number | null;
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
      ied: string;
    }>;
    tla_tasks: Array<{
      id?: number;
      at_code: string;
      at_name: string;
      at_tool: string;
      weight: string;
    }>;
    tla_assessment_method: {
      id?: number;
      teaching_methods: string[];
      learning_resources: string[];
    };
  }>;
}

interface CourseRevisionState {
  // Current course data
  currentCourse: CurriculumCourse | null;

  // Modified sections tracking
  modifiedSections: Set<string>;

  // Course outcomes
  courseOutcomes: CourseOutcome[];

  //=====================Actions=====================//
  setCurrentCourse: (course: CurriculumCourse) => void;

  //=======Course Outcome actions=======//
  setCourseOutcomes: (outcomes: CourseOutcome[]) => void;
  addCourseOutcome: (outcome: Omit<CourseOutcome, "id">) => void;
  updateCourseOutcome: (
    id: number | null,
    outcome: Partial<CourseOutcome>
  ) => void;
  removeCourseOutcome: (id: number | null) => void;

  //=======other actions=======//
  markSectionAsModified: (section: string) => void;
  resetStore: () => void;
  resetCourseOutcomes: () => void;
  resetABCDModels: () => void;
  resetCPAClassifications: () => void;
  resetCOPOMappings: () => void;
  generateSubmissionPayload: () => CourseOutcomeSubmissionPayload;
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
      // Generate a unique temporary ID (negative to avoid collisions with server IDs)
      const tempId = -Date.now();

      const newOutcome: CourseOutcome = {
        ...outcome,
        id: tempId, // Use temporary negative ID instead of null
      };

      set((state) => ({
        courseOutcomes: [...state.courseOutcomes, newOutcome],
      }));
      get().markSectionAsModified("course_outcomes");
    },

    updateCourseOutcome: (id, updates) => {
      set((state) => ({
        courseOutcomes: state.courseOutcomes.map((outcome) =>
          outcome.id === id || (outcome.id === null && id === null)
            ? { ...outcome, ...updates }
            : outcome
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
    resetCPAClassifications: () => {
      const { currentCourse, courseOutcomes } = get();
      if (currentCourse) {
        // Reset only CPA data while preserving other modifications
        const originalOutcomes = currentCourse.course_outcomes || [];

        set({
          courseOutcomes: courseOutcomes.map((outcome) => {
            // Find the original outcome by ID
            const originalOutcome = originalOutcomes.find(
              (orig) => orig.id === outcome.id
            );

            if (originalOutcome) {
              // Reset only CPA data, keep other modifications
              return {
                ...outcome,
                cpa: originalOutcome.cpa,
              };
            }

            // For new outcomes (negative IDs), reset CPA to empty
            if (outcome.id && outcome.id < 0) {
              return {
                ...outcome,
                cpa: "",
              };
            }

            return outcome;
          }),
        });

        // Remove only the CPA section from modified sections
        const modifiedSections = new Set(get().modifiedSections);
        modifiedSections.delete("cpa");
        set({ modifiedSections });
      }
    },
    resetABCDModels: () => {
      const { currentCourse, courseOutcomes } = get();
      if (currentCourse) {
        // Reset only ABCD data while preserving other modifications
        const originalOutcomes = currentCourse.course_outcomes || [];

        set({
          courseOutcomes: courseOutcomes.map((outcome) => {
            // Find the original outcome by ID
            const originalOutcome = originalOutcomes.find(
              (orig) => orig.id === outcome.id
            );

            if (originalOutcome) {
              // Reset only ABCD data, keep other modifications
              return {
                ...outcome,
                abcd: {
                  audience: originalOutcome.abcd.audience,
                  behavior: originalOutcome.abcd.behavior,
                  condition: originalOutcome.abcd.condition,
                  degree: originalOutcome.abcd.degree,
                },
              };
            }

            // For new outcomes (negative IDs), reset ABCD to empty
            if (outcome.id && outcome.id < 0) {
              return {
                ...outcome,
                abcd: {
                  audience: "",
                  behavior: "",
                  condition: "",
                  degree: "",
                },
              };
            }

            return outcome;
          }),
        });

        // Remove only the ABCD section from modified sections
        const modifiedSections = new Set(get().modifiedSections);
        modifiedSections.delete("course_outcomes"); // Remove this if only ABCD was modified
        set({ modifiedSections });
      }
    },
    resetCOPOMappings: () => {
      const { currentCourse, courseOutcomes } = get();
      if (currentCourse) {
        // Reset only CO-PO mapping data while preserving other modifications
        const originalOutcomes = currentCourse.course_outcomes || [];

        set({
          courseOutcomes: courseOutcomes.map((outcome) => {
            // Find the original outcome by ID
            const originalOutcome = originalOutcomes.find(
              (orig) => orig.id === outcome.id
            );

            if (originalOutcome) {
              // Reset only PO mappings, keep other modifications
              return {
                ...outcome,
                po_mappings: originalOutcome.po_mappings.map((mapping) => ({
                  ...mapping,
                })),
              };
            }

            // For new outcomes (negative IDs), reset PO mappings to empty
            if (outcome.id && outcome.id < 0) {
              return {
                ...outcome,
                po_mappings: [],
              };
            }

            return outcome;
          }),
        });

        // Remove only the CO-PO mapping section from modified sections
        const modifiedSections = new Set(get().modifiedSections);
        modifiedSections.delete("po_mappings");
        set({ modifiedSections });
      }
    },

    generateSubmissionPayload: () => {
      const { courseOutcomes } = get();

      return {
        course_outcomes: courseOutcomes.map((outcome) => ({
          id: outcome.id && outcome.id > 0 ? outcome.id : null,
          name: outcome.name,
          statement: outcome.statement,
          abcd: {
            audience: outcome.abcd.audience,
            behavior: outcome.abcd.behavior,
            condition: outcome.abcd.condition,
            degree: outcome.abcd.degree,
          },
          cpa: outcome.cpa,
          po_mappings: outcome.po_mappings.map((mapping) => ({
            po_id: mapping.po_id,
            ied: mapping.ied,
          })),
          tla_tasks: outcome.tla_tasks.map((task) => ({
            ...(task.id && { id: task.id }),
            at_code: task.at_code,
            at_name: task.at_name,
            at_tool: task.at_tool,
            weight: task.weight,
          })),
          tla_assessment_method: {
            ...(outcome.tla_assessment_method.id && {
              id: outcome.tla_assessment_method.id,
            }),
            teaching_methods: outcome.tla_assessment_method.teaching_methods,
            learning_resources:
              outcome.tla_assessment_method.learning_resources,
          },
        })),
      };
    },
  })
);
