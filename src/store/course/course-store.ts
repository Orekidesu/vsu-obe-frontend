import { create } from "zustand";

// Define the Course Outcome interface
export interface CourseOutcome {
  id: number;
  name: string;
  statement: string;
}
// Define the Program Outcome interface
export interface ProgramOutcome {
  id: number;
  name: string;
  statement: string;
  availableContributionLevels: ("I" | "E" | "D")[]; // Which contribution levels are available for this PO
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

// Define the CO_PO mapping interface with contribution levels
export interface CO_PO_Mapping {
  courseOutcomeId: number;
  programOutcomeId: number;
  contributionLevel: "I" | "E" | "D"; // Introductory, Enabling, Development
}

// Define the Assessment Task interface
export interface AssessmentTask {
  id: string; // Unique identifier
  courseOutcomeId: number; // Which CO this task belongs to
  code: string; // e.g., Q1, MT, FE, LB1
  name: string; // e.g., Quiz 1, Midterm, Final Exam
  tool: string; // e.g., Marking Scheme, Rubric
  weight: number; // Weight in percentage (e.g., 10 for 10%)
}

// Define the Teaching Method interface
export interface TeachingMethod {
  id: string;
  name: string;
}

// Define the Learning Resource interface
export interface LearningResource {
  id: string;
  name: string;
}

// Define the CO Teaching Methods and Learning Resources mapping
export interface CO_TL_Mapping {
  courseOutcomeId: number;
  teachingMethods: string[];
  learningResources: string[];
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

  // Program outcomes (for CO-PO mapping)
  programOutcomes: ProgramOutcome[];

  // ABCD mappings
  coAbcdMappings: CO_ABCD_Mapping[];

  // CPA mappings
  coCpaMappings: CO_CPA_Mapping[];

  // CO-PO mappings
  coPoMappings: CO_PO_Mapping[];

  // Assessment tasks
  assessmentTasks: AssessmentTask[];

  // Teaching methods and learning resources
  teachingMethods: TeachingMethod[];
  learningResources: LearningResource[];
  coTLMappings: CO_TL_Mapping[];

  // Actions
  setCourseInfo: (
    courseId: string,
    courseCode: string,
    courseTitle: string
  ) => void;
  addCourseOutcome: () => void;
  updateCourseOutcome: (id: number, name: string, statement: string) => void;
  removeCourseOutcome: (id: number) => void;
  setProgramOutcomes: (outcomes: ProgramOutcome[]) => void;

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

  // CO-PO mapping actions
  updateCourseOutcomePO: (
    courseOutcomeId: number,
    programOutcomeId: number,
    contributionLevel: "I" | "E" | "D" | null
  ) => void;
  getPOMappingsForCO: (courseOutcomeId: number) => CO_PO_Mapping[];

  // Assessment task actions
  addAssessmentTask: (courseOutcomeId: number) => void;
  updateAssessmentTask: (
    id: string,
    courseOutcomeId: number,
    code: string,
    name: string,
    tool: string,
    weight: number
  ) => void;
  removeAssessmentTask: (id: string) => void;
  getAssessmentTasksForCO: (courseOutcomeId: number) => AssessmentTask[];
  getTotalAssessmentWeight: () => number;

  // Teaching methods and learning resources actions
  addTeachingMethod: (name: string) => void;
  removeTeachingMethod: (id: string) => void;
  addLearningResource: (name: string) => void;
  removeLearningResource: (id: string) => void;
  updateCOTeachingMethods: (
    courseOutcomeId: number,
    methodIds: string[]
  ) => void;
  updateCOLearningResources: (
    courseOutcomeId: number,
    resourceIds: string[]
  ) => void;
  getCOTeachingMethods: (courseOutcomeId: number) => string[];
  getCOLearningResources: (courseOutcomeId: number) => string[];

  // Reset function
  resetStore: () => void;
}

export const useCourseDetailsStore = create<CourseDetailsState>((set, get) => ({
  // Initial state
  courseId: "",
  courseCode: "",
  courseTitle: "",
  currentStep: 1,
  courseOutcomes: [{ id: 1, name: "", statement: "" }], // Start with one empty outcome
  programOutcomes: [], // Will be populated from API or parent component
  coAbcdMappings: [], // Start with empty mappings
  coCpaMappings: [], // Start with empty CPA mappings
  coPoMappings: [], // Start with empty CO-PO mappings
  assessmentTasks: [],

  // Teaching methods and learning resources
  teachingMethods: [
    { id: "tm_1", name: "Lecture" },
    { id: "tm_2", name: "Discussion" },
    { id: "tm_3", name: "Demonstration" },
    { id: "tm_4", name: "Group Work" },
    { id: "tm_5", name: "Problem-Based Learning" },
    { id: "tm_6", name: "Case Study" },
    { id: "tm_7", name: "Role Play" },
    { id: "tm_8", name: "Simulation" },
    { id: "tm_9", name: "Project" },
    { id: "tm_10", name: "Laboratory" },
    { id: "tm_11", name: "Field Trip" },
    { id: "tm_12", name: "Flipped Classroom" },
    { id: "tm_13", name: "Peer Teaching" },
    { id: "tm_14", name: "Experiments" },
  ],
  learningResources: [
    { id: "lr_1", name: "Textbooks" },
    { id: "lr_2", name: "Reference Books" },
    { id: "lr_3", name: "Lecture Notes" },
    { id: "lr_4", name: "PPT Slides" },
    { id: "lr_5", name: "Videos" },
    { id: "lr_6", name: "Online Tutorials" },
    { id: "lr_7", name: "Journal Articles" },
    { id: "lr_8", name: "Software" },
    { id: "lr_9", name: "Websites" },
    { id: "lr_10", name: "Lab Manuals" },
  ],
  coTLMappings: [],

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

      // Also remove any PO mappings for this outcome
      const updatedPOMappings = state.coPoMappings.filter(
        (mapping) => mapping.courseOutcomeId !== id
      );
      // Also remove any assessment tasks for this outcome
      const updatedAssessmentTasks = state.assessmentTasks.filter(
        (task) => task.courseOutcomeId !== id
      );

      // Also remove any TL mappings for this outcome
      const updatedTLMappings = state.coTLMappings.filter(
        (mapping) => mapping.courseOutcomeId !== id
      );

      return {
        courseOutcomes: updatedOutcomes,
        coAbcdMappings: updatedABCDMappings,
        coCpaMappings: updatedCPAMappings,
        coPoMappings: updatedPOMappings,
        assessmentTasks: updatedAssessmentTasks,
        coTLMappings: updatedTLMappings,
      };
    }),

  // Program Outcomes actions
  setProgramOutcomes: (outcomes) => set({ programOutcomes: outcomes }),

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
  // CO-PO mapping actions
  updateCourseOutcomePO: (
    courseOutcomeId,
    programOutcomeId,
    contributionLevel
  ) =>
    set((state) => {
      // Check if a mapping already exists for this CO-PO pair
      const existingMappingIndex = state.coPoMappings.findIndex(
        (mapping) =>
          mapping.courseOutcomeId === courseOutcomeId &&
          mapping.programOutcomeId === programOutcomeId
      );

      const updatedMappings = [...state.coPoMappings];

      if (contributionLevel === null) {
        // If null, remove the mapping
        if (existingMappingIndex >= 0) {
          updatedMappings.splice(existingMappingIndex, 1);
        }
      } else {
        // Find the PO to check if the contribution level is valid
        const po = state.programOutcomes.find(
          (po) => po.id === programOutcomeId
        );

        // Only update if the contribution level is available for this PO
        if (po && po.availableContributionLevels?.includes(contributionLevel)) {
          if (existingMappingIndex >= 0) {
            // Update existing mapping
            updatedMappings[existingMappingIndex] = {
              courseOutcomeId,
              programOutcomeId,
              contributionLevel,
            };
          } else {
            // Create new mapping
            updatedMappings.push({
              courseOutcomeId,
              programOutcomeId,
              contributionLevel,
            });
          }
        }
      }

      return { coPoMappings: updatedMappings };
    }),

  getPOMappingsForCO: (courseOutcomeId) => {
    const state = get();
    return state.coPoMappings.filter(
      (mapping) => mapping.courseOutcomeId === courseOutcomeId
    );
  },
  // Assessment task actions
  addAssessmentTask: (courseOutcomeId) =>
    set((state) => {
      // Generate a unique ID for the new task
      const id = `task_${state.assessmentTasks.length + 1}`;
      // const id = `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      return {
        assessmentTasks: [
          ...state.assessmentTasks,
          {
            id,
            courseOutcomeId,
            code: "", // Empty by default
            name: "", // Empty by default
            tool: "Marking Scheme",
            weight: 0, // Default weight
          },
        ],
      };
    }),

  updateAssessmentTask: (id, courseOutcomeId, code, name, tool, weight) =>
    set((state) => ({
      assessmentTasks: state.assessmentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              courseOutcomeId,
              code,
              name,
              tool,
              weight,
            }
          : task
      ),
    })),

  removeAssessmentTask: (id) =>
    set((state) => ({
      assessmentTasks: state.assessmentTasks.filter((task) => task.id !== id),
    })),

  getAssessmentTasksForCO: (courseOutcomeId) => {
    const state = get();
    return state.assessmentTasks.filter(
      (task) => task.courseOutcomeId === courseOutcomeId
    );
  },

  getTotalAssessmentWeight: () => {
    const state = get();
    return state.assessmentTasks.reduce(
      (total, task) => total + task.weight,
      0
    );
  },

  // Teaching methods and learning resources actions
  addTeachingMethod: (name) =>
    set((state) => {
      const id = `tm_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      return {
        teachingMethods: [...state.teachingMethods, { id, name }],
      };
    }),

  removeTeachingMethod: (id) =>
    set((state) => {
      // Remove the teaching method
      const updatedMethods = state.teachingMethods.filter(
        (method) => method.id !== id
      );

      // Also remove this method from any CO mappings
      const updatedMappings = state.coTLMappings.map((mapping) => ({
        ...mapping,
        teachingMethods: mapping.teachingMethods.filter(
          (methodId) => methodId !== id
        ),
      }));

      return {
        teachingMethods: updatedMethods,
        coTLMappings: updatedMappings,
      };
    }),

  addLearningResource: (name) =>
    set((state) => {
      const id = `lr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      return {
        learningResources: [...state.learningResources, { id, name }],
      };
    }),

  removeLearningResource: (id) =>
    set((state) => {
      // Remove the learning resource
      const updatedResources = state.learningResources.filter(
        (resource) => resource.id !== id
      );

      // Also remove this resource from any CO mappings
      const updatedMappings = state.coTLMappings.map((mapping) => ({
        ...mapping,
        learningResources: mapping.learningResources.filter(
          (resourceId) => resourceId !== id
        ),
      }));

      return {
        learningResources: updatedResources,
        coTLMappings: updatedMappings,
      };
    }),

  updateCOTeachingMethods: (courseOutcomeId, methodIds) =>
    set((state) => {
      // Check if a mapping already exists for this CO
      const existingMappingIndex = state.coTLMappings.findIndex(
        (mapping) => mapping.courseOutcomeId === courseOutcomeId
      );

      const updatedMappings = [...state.coTLMappings];

      if (existingMappingIndex >= 0) {
        // Update existing mapping
        updatedMappings[existingMappingIndex] = {
          ...updatedMappings[existingMappingIndex],
          teachingMethods: methodIds,
        };
      } else {
        // Create new mapping
        updatedMappings.push({
          courseOutcomeId,
          teachingMethods: methodIds,
          learningResources: [],
        });
      }

      return { coTLMappings: updatedMappings };
    }),

  updateCOLearningResources: (courseOutcomeId, resourceIds) =>
    set((state) => {
      // Check if a mapping already exists for this CO
      const existingMappingIndex = state.coTLMappings.findIndex(
        (mapping) => mapping.courseOutcomeId === courseOutcomeId
      );

      const updatedMappings = [...state.coTLMappings];

      if (existingMappingIndex >= 0) {
        // Update existing mapping
        updatedMappings[existingMappingIndex] = {
          ...updatedMappings[existingMappingIndex],
          learningResources: resourceIds,
        };
      } else {
        // Create new mapping
        updatedMappings.push({
          courseOutcomeId,
          teachingMethods: [],
          learningResources: resourceIds,
        });
      }

      return { coTLMappings: updatedMappings };
    }),

  getCOTeachingMethods: (courseOutcomeId) => {
    const state = get();
    const mapping = state.coTLMappings.find(
      (mapping) => mapping.courseOutcomeId === courseOutcomeId
    );
    return mapping ? mapping.teachingMethods : [];
  },

  getCOLearningResources: (courseOutcomeId) => {
    const state = get();
    const mapping = state.coTLMappings.find(
      (mapping) => mapping.courseOutcomeId === courseOutcomeId
    );
    return mapping ? mapping.learningResources : [];
  },

  // Reset function to clear all state
  resetStore: () =>
    set({
      currentStep: 1,
      courseOutcomes: [{ id: 1, name: "", statement: "" }],
      coAbcdMappings: [],
      coCpaMappings: [],
      coPoMappings: [],
      assessmentTasks: [],
    }),
}));
