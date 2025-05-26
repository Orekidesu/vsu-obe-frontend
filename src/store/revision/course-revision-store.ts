import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Add this import

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

export interface ProgramOutcome {
  id: number;
  name: string;
  statement: string;
  availableContributionLevels: string[]; // Add this property
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
  units: string | number;
  is_in_revision: boolean;
  is_completed: boolean;
  course_outcomes: CourseOutcome[];

  //
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

  // Custom teaching methods and learning resources
  customTeachingMethods: string[];
  customLearningResources: string[];

  // UI state properties - add these
  currentStep: number;
  isRevising: boolean;
  showReview: boolean;

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

  //======Program outcome actions=======//
  programOutcomes: ProgramOutcome[];
  setProgramOutcomes: (outcomes: ProgramOutcome[]) => void;

  //=======other actions=======//
  markSectionAsModified: (section: string) => void;
  resetStore: () => void;
  resetCourseOutcomes: () => void;
  resetABCDModels: () => void;
  resetCPAClassifications: () => void;
  resetCOPOMappings: () => void;
  resetTLATasks: () => void;
  // TLA Methods actions
  updateTLAMethods: (
    outcomeId: number | null,
    teachingMethods: string[],
    learningResources: string[]
  ) => void;
  addCustomTeachingMethod: (method: string) => void;
  addCustomLearningResource: (resource: string) => void;
  resetTLAMethods: () => void;
  // UI state actions - add these
  setCurrentStep: (step: number) => void;
  setIsRevising: (isRevising: boolean) => void;
  setShowReview: (showReview: boolean) => void;

  resetUIState: () => void;

  generateSubmissionPayload: () => CourseOutcomeSubmissionPayload;
}
export const useCourseRevisionStore = create<CourseRevisionState>()(
  persist(
    (set, get) => ({
      currentCourse: null,
      modifiedSections: new Set(),
      courseOutcomes: [],
      programOutcomes: [], // Add this missing property
      customTeachingMethods: [],
      customLearningResources: [],

      // Initialize UI state
      currentStep: 0,
      isRevising: false,
      showReview: false,

      // UI state actions
      setCurrentStep: (step) => set({ currentStep: step }),
      setIsRevising: (isRevising) => set({ isRevising }),
      setShowReview: (showReview) => set({ showReview }),

      // Add this missing method
      setProgramOutcomes: (outcomes) => {
        set({ programOutcomes: outcomes });
      },

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

      // Update resetStore to reset UI state and clear localStorage
      resetStore: () => {
        // Clear localStorage for this store
        localStorage.removeItem("course-revision-storage");

        set({
          currentCourse: null,
          modifiedSections: new Set(),
          courseOutcomes: [],
          customTeachingMethods: [],
          customLearningResources: [],
          currentStep: 0,
          isRevising: false,
          showReview: false,
        });
      },

      // Add a method to reset only UI state
      resetUIState: () => {
        set({
          currentStep: 0,
          isRevising: false,
          showReview: false,
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
      resetTLATasks: () => {
        const { currentCourse, courseOutcomes } = get();
        if (currentCourse) {
          // Reset only TLA tasks data while preserving other modifications
          const originalOutcomes = currentCourse.course_outcomes || [];

          set({
            courseOutcomes: courseOutcomes.map((outcome) => {
              // Find the original outcome by ID
              const originalOutcome = originalOutcomes.find(
                (orig) => orig.id === outcome.id
              );

              if (originalOutcome) {
                // Reset only TLA tasks, keep other modifications
                return {
                  ...outcome,
                  tla_tasks: originalOutcome.tla_tasks.map((task) => ({
                    ...task,
                  })),
                };
              }

              // For new outcomes (negative IDs), reset TLA tasks to empty
              if (outcome.id && outcome.id < 0) {
                return {
                  ...outcome,
                  tla_tasks: [],
                };
              }

              return outcome;
            }),
          });

          // Remove only the TLA tasks section from modified sections
          const modifiedSections = new Set(get().modifiedSections);
          modifiedSections.delete("tla_tasks");
          set({ modifiedSections });
        }
      },

      updateTLAMethods: (outcomeId, teachingMethods, learningResources) => {
        set((state) => ({
          courseOutcomes: state.courseOutcomes.map((outcome) =>
            outcome.id === outcomeId
              ? {
                  ...outcome,
                  tla_assessment_method: {
                    ...outcome.tla_assessment_method,
                    teaching_methods: teachingMethods,
                    learning_resources: learningResources,
                  },
                }
              : outcome
          ),
        }));
        get().markSectionAsModified("tla_assessment_method");
      },

      addCustomTeachingMethod: (method) => {
        set((state) => ({
          customTeachingMethods: [
            ...new Set([...state.customTeachingMethods, method]),
          ],
        }));
      },

      addCustomLearningResource: (resource) => {
        set((state) => ({
          customLearningResources: [
            ...new Set([...state.customLearningResources, resource]),
          ],
        }));
      },

      resetTLAMethods: () => {
        const { currentCourse, courseOutcomes } = get();
        if (currentCourse) {
          const originalOutcomes = currentCourse.course_outcomes || [];

          set({
            courseOutcomes: courseOutcomes.map((outcome) => {
              const originalOutcome = originalOutcomes.find(
                (orig) => orig.id === outcome.id
              );

              if (originalOutcome) {
                return {
                  ...outcome,
                  tla_assessment_method: {
                    ...originalOutcome.tla_assessment_method,
                    teaching_methods: [
                      ...originalOutcome.tla_assessment_method.teaching_methods,
                    ],
                    learning_resources: [
                      ...originalOutcome.tla_assessment_method
                        .learning_resources,
                    ],
                  },
                };
              }

              if (outcome.id && outcome.id < 0) {
                return {
                  ...outcome,
                  tla_assessment_method: {
                    teaching_methods: [],
                    learning_resources: [],
                  },
                };
              }

              return outcome;
            }),
          });

          const modifiedSections = new Set(get().modifiedSections);
          modifiedSections.delete("tla_assessment_method");
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
    }),
    {
      name: "course-revision-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),

      // Only persist what we need
      partialize: (state) => ({
        currentCourse: state.currentCourse,
        courseOutcomes: state.courseOutcomes,
        modifiedSections: Array.from(state.modifiedSections),
        customTeachingMethods: state.customTeachingMethods,
        customLearningResources: state.customLearningResources,

        // Include UI state
        currentStep: state.currentStep,
        isRevising: state.isRevising,
        showReview: state.showReview,
      }),

      // Convert arrays back to Set objects when rehydrating
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.modifiedSections)) {
          state.modifiedSections = new Set(state.modifiedSections);
        }
      },
    }
  )
);
