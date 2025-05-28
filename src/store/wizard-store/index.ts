import { create } from "zustand";
import { WizardState } from "./types";
import { persist, createJSONStorage } from "zustand/middleware";
import { createProgramSlice } from "./program-slice";
import { createCurriculumSlice } from "./curriculum-slice";
import { createCourseSlice } from "./course-slice";
import { createPEOSlice } from "./peo-slice";
import { createProgramOutcomeSlice } from "./program-outcome-slice";
import { createMappingSlice } from "./mapping-slice";

import { createCommitteeSlice } from "./committee-slice";
import { createUISlice } from "./ui-slice";

import {
  predefinedYearSemesters,
  createProgramTemplates,
  initialPremadeCourseCategories,
} from "./initial-state";

// Export combined store
// export const useWizardStore = create<WizardState>((set, get, api) => ({
//   ...createProgramSlice(set, get, api),
//   ...createCurriculumSlice(set, get, api),
//   ...createCourseSlice(set, get, api),
//   ...createPEOSlice(set, get, api),
//   ...createProgramOutcomeSlice(set, get, api),
//   ...createMappingSlice(set, get, api),
//   ...createCommitteeSlice(set, get, api),

//   // Graduate attributes are not in a slice
//   graduateAttributes: [],
//   setGraduateAttributes: (graduateAttributes) => set({ graduateAttributes }),
//   setPremadeCourseCategories: (categories) =>
//     set({ premadeCourseCategories: categories }),

//   // Initialize template-related state directly
//   programTemplates: createProgramTemplates(),
//   predefinedYearSemesters: predefinedYearSemesters,
//   premadeCourseCategories: initialPremadeCourseCategories,
// }));

// ==================== OPTION 2=====================
export const useWizardStore = create<WizardState>()(
  persist(
    (set, get, api) => ({
      ...createProgramSlice(set, get, api),
      ...createCurriculumSlice(set, get, api),
      ...createCourseSlice(set, get, api),
      ...createPEOSlice(set, get, api),
      ...createProgramOutcomeSlice(set, get, api),
      ...createMappingSlice(set, get, api),
      ...createCommitteeSlice(set, get, api),
      ...createUISlice(set, get, api), // Add this line

      // Graduate attributes are not in a slice
      graduateAttributes: [],
      setGraduateAttributes: (graduateAttributes) =>
        set({ graduateAttributes }),
      setPremadeCourseCategories: (categories) =>
        set({ premadeCourseCategories: categories }),
      setPremadeCourses: (courses) => set({ premadeCourses: courses }),

      // Initialize template-related state directly
      programTemplates: createProgramTemplates(),
      predefinedYearSemesters: predefinedYearSemesters,
      premadeCourseCategories: initialPremadeCourseCategories,

      resetStore: () =>
        set({
          // Reset program-related fields
          formType: "",
          programName: "",
          programAbbreviation: "",
          selectedProgram: "",

          // Reset curriculum-related fields
          curriculumName: "",
          academicYear: "",
          yearSemesters: [],

          // Reset course-related fields
          courseCategories: [{ id: 15, name: "General Education", code: "GE" }],
          curriculumCourses: [],
          courseToPOMappings: [],

          // Reset educational objectives
          peos: [{ id: 1, statement: "" }],
          programOutcomes: [{ id: 1, name: "", statement: "" }],

          // Reset mappings
          peoToMissionMappings: [],
          gaToPEOMappings: [],
          poToPEOMappings: [],
          poToGAMappings: [],

          // Reset committee assignments
          selectedCommittees: [],
          committeeCourseAssignments: [],

          // Reset UI state
          currentStep: 1,
        }),
    }),
    {
      name: "program-wizard-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      // Optional: Select which parts of the state to persist
      partialize: (state) => ({
        // Include only the form data that needs to persist
        formType: state.formType,
        programName: state.programName,
        programAbbreviation: state.programAbbreviation,
        selectedProgram: state.selectedProgram,
        curriculumName: state.curriculumName,
        academicYear: state.academicYear,
        yearSemesters: state.yearSemesters,
        courseCategories: state.courseCategories,
        curriculumCourses: state.curriculumCourses,
        courseToPOMappings: state.courseToPOMappings,
        peos: state.peos,
        programOutcomes: state.programOutcomes,
        peoToMissionMappings: state.peoToMissionMappings,
        gaToPEOMappings: state.gaToPEOMappings,
        poToPEOMappings: state.poToPEOMappings,
        poToGAMappings: state.poToGAMappings,
        selectedCommittees: state.selectedCommittees,
        committeeCourseAssignments: state.committeeCourseAssignments,
        currentStep: state.currentStep,
        // formType: state.formType,
      }),
    }
  )
);

// ===================OPTION 3=======================
// export const createProgramWizardStore = (programId: string) => {
//   return create<WizardState>()(
//     persist(
//       (set, get, api) => ({
//         ...createProgramSlice(set, get, api),
//         ...createCurriculumSlice(set, get, api),
//         ...createCourseSlice(set, get, api),
//         ...createPEOSlice(set, get, api),
//         ...createProgramOutcomeSlice(set, get, api),
//         ...createMappingSlice(set, get, api),
//         ...createCommitteeSlice(set, get, api),
//         ...createUISlice(set, get, api),

//         // Graduate attributes are not in a slice
//         graduateAttributes: [],
//         setGraduateAttributes: (graduateAttributes) =>
//           set({ graduateAttributes }),
//         setPremadeCourseCategories: (categories) =>
//           set({ premadeCourseCategories: categories }),
//         setPremadeCourses: (courses) => set({ premadeCourses: courses }),

//         // Initialize template-related state directly
//         programTemplates: createProgramTemplates(),
//         predefinedYearSemesters: predefinedYearSemesters,
//         premadeCourseCategories: initialPremadeCourseCategories,
//       }),
//       {
//         name: `program-wizard-${programId}`, // Make localStorage key unique per program
//         storage: createJSONStorage(() => localStorage),
//         partialize: (state) => ({
//           // Include only the form data that needs to persist
//           formType: state.formType,
//           programName: state.programName,
//           programAbbreviation: state.programAbbreviation,
//           selectedProgram: state.selectedProgram,
//           curriculumName: state.curriculumName,
//           academicYear: state.academicYear,
//           yearSemesters: state.yearSemesters,
//           courseCategories: state.courseCategories,
//           curriculumCourses: state.curriculumCourses,
//           courseToPOMappings: state.courseToPOMappings,
//           peos: state.peos,
//           programOutcomes: state.programOutcomes,
//           peoToMissionMappings: state.peoToMissionMappings,
//           gaToPEOMappings: state.gaToPEOMappings,
//           poToPEOMappings: state.poToPEOMappings,
//           poToGAMappings: state.poToGAMappings,
//           selectedCommittees: state.selectedCommittees,
//           committeeCourseAssignments: state.committeeCourseAssignments,
//           currentStep: state.currentStep,
//         }),
//       }
//     )
//   );
// };

// Re-export types
export * from "./types";

// Alternative
