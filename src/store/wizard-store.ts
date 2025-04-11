import { create } from "zustand";
import { GraduateAttribute } from "@/types/model/GraduateAttributes";
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";

interface ProgramOutcome {
  id: number;
  name: string;
  statement: string;
}

// Define the Mapping interface
interface PEOToMissionMapping {
  peoId: number;
  missionId: number;
}

interface GAToPEOMapping {
  gaId: number; // Keep as string for compatibility with existing mappings
  peoId: number;
}

interface POToPEOMapping {
  poId: number;
  peoId: number;
}

interface POToGAMapping {
  poId: number;
  gaId: number;
}

export interface YearSemester {
  id: string;
  year: number;
  semester: string;
}
interface PredefinedYearSemester {
  year: number;
  semester: string;
  label: string;
}

interface WizardState {
  formType: string;
  programName: string;
  programAbbreviation: string;
  selectedProgram: string;
  curriculumName: string;
  academicYear: string;
  yearSemesters: YearSemester[];
  peos: ProgramEducationalObjective[];
  programOutcomes: ProgramOutcome[];
  graduateAttributes: GraduateAttribute[];
  peoToMissionMappings: PEOToMissionMapping[];
  gaToPEOMappings: GAToPEOMapping[];
  poToPEOMappings: POToPEOMapping[];
  poToGAMappings: POToGAMapping[];

  predefinedYearSemesters: PredefinedYearSemester[];

  // Add setters for the GAs
  setGraduateAttributes: (graduateAttributes: GraduateAttribute[]) => void;

  setFormType: (type: string) => void;
  setProgramName: (name: string) => void;
  setProgramAbbreviation: (abbreviation: string) => void;
  setSelectedProgram: (program: string) => void;
  setCurriculumName: (name: string) => void;
  setAcademicYear: (year: string) => void;
  addYearSemester: (year: number, semester: string) => void;
  removeYearSemester: (id: string) => void;
  addPEO: () => void;
  updatePEO: (id: number, statement: string) => void;
  removePEO: (id: number) => void;
  addProgramOutcome: () => void;
  updateProgramOutcome: (id: number, name: string, statement: string) => void;
  removeProgramOutcome: (id: number) => void;
  toggleMapping: (peoId: number, missionId: number) => void;
  toggleGAToPEOMapping: (gaId: number, peoId: number) => void;
  togglePOToPEOMapping: (poId: number, peoId: number) => void;
  togglePOToGAMapping: (poId: number, gaId: number) => void;
}

// Default empty array for graduate attributes (will be replaced by fetched data)
const defaultGraduateAttributes: GraduateAttribute[] = [];
const initialYearSemesters: YearSemester[] = [
  { id: "1-first", year: 1, semester: "first" },
];

export const useWizardStore = create<WizardState>((set) => ({
  formType: "",
  programName: "",
  programAbbreviation: "",
  selectedProgram: "",
  curriculumName: "",
  academicYear: "",
  yearSemesters: initialYearSemesters,
  peos: [{ id: 1, statement: "" }], // Start with one empty PEO
  programOutcomes: [{ id: 1, name: "", statement: "" }], // Start with one empty Program Outcome
  graduateAttributes: defaultGraduateAttributes, // Start with empty array
  // mappings: [],
  peoToMissionMappings: [],
  gaToPEOMappings: [],
  poToPEOMappings: [],
  poToGAMappings: [],

  predefinedYearSemesters: [
    { year: 1, semester: "first", label: "Year 1 - First Semester" },
    { year: 1, semester: "second", label: "Year 1 - Second Semester" },
    { year: 1, semester: "midyear", label: "Year 1 - Midyear" },
    { year: 2, semester: "first", label: "Year 2 - First Semester" },
    { year: 2, semester: "second", label: "Year 2 - Second Semester" },
    { year: 2, semester: "midyear", label: "Year 2 - Midyear" },
    { year: 3, semester: "first", label: "Year 3 - First Semester" },
    { year: 3, semester: "second", label: "Year 3 - Second Semester" },
    { year: 3, semester: "midyear", label: "Year 3 - Midyear" },
    { year: 4, semester: "first", label: "Year 4 - First Semester" },
    { year: 4, semester: "second", label: "Year 4 - Second Semester" },
    { year: 4, semester: "midyear", label: "Year 4 - Midyear" },
  ],

  setGraduateAttributes: (graduateAttributes) => set({ graduateAttributes }),

  setFormType: (type) => set({ formType: type }),
  setProgramName: (name) => set({ programName: name }),
  setProgramAbbreviation: (abbreviation) =>
    set({ programAbbreviation: abbreviation }),
  setSelectedProgram: (program) => set({ selectedProgram: program }),
  setCurriculumName: (name) => set({ curriculumName: name }),
  setAcademicYear: (year) => set({ academicYear: year }),
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
    set((state) => ({
      yearSemesters: state.yearSemesters.filter((ys) => ys.id !== id),
    })),

  addPEO: () =>
    set((state) => {
      const newId =
        state.peos.length > 0
          ? Math.max(...state.peos.map((peo) => peo.id)) + 1
          : 1;
      return { peos: [...state.peos, { id: newId, statement: "" }] };
    }),

  updatePEO: (id, statement) =>
    set((state) => ({
      peos: state.peos.map((peo) =>
        peo.id === id ? { ...peo, statement } : peo
      ),
    })),

  removePEO: (id) =>
    set((state) => ({
      peos: state.peos.filter((peo) => peo.id !== id),
      peoToMissionMappings: state.peoToMissionMappings.filter(
        (mapping) => mapping.peoId !== id
      ),
      gaToPEOMappings: state.gaToPEOMappings.filter(
        (mapping) => mapping.peoId !== id
      ),
    })),
  addProgramOutcome: () =>
    set((state) => {
      const newId =
        state.programOutcomes.length > 0
          ? Math.max(...state.programOutcomes.map((po) => po.id)) + 1
          : 1;
      return {
        programOutcomes: [
          ...state.programOutcomes,
          { id: newId, name: "", statement: "" },
        ],
      };
    }),

  updateProgramOutcome: (id, name, statement) =>
    set((state) => ({
      programOutcomes: state.programOutcomes.map((po) =>
        po.id === id ? { ...po, name, statement } : po
      ),
    })),

  removeProgramOutcome: (id) =>
    set((state) => ({
      programOutcomes: state.programOutcomes.filter((po) => po.id !== id),
      poToPEOMappings: state.poToPEOMappings.filter(
        (mapping) => mapping.poId !== id
      ),
      poToGAMappings: state.poToGAMappings.filter(
        (mapping) => mapping.poId !== id
      ),
    })),

  toggleMapping: (peoId, missionId) =>
    set((state) => {
      const existingMapping = state.peoToMissionMappings.find(
        (m) => m.peoId === peoId && m.missionId === missionId
      );

      if (existingMapping) {
        return {
          mappings: state.peoToMissionMappings.filter(
            (m) => !(m.peoId === peoId && m.missionId === missionId)
          ),
        };
      } else {
        return {
          peoToMissionMappings: [
            ...state.peoToMissionMappings,
            { peoId, missionId },
          ],
        };
      }
    }),

  toggleGAToPEOMapping: (gaId, peoId) =>
    set((state) => {
      const existingMapping = state.gaToPEOMappings.find(
        (m) => m.gaId === gaId && m.peoId === peoId
      );

      if (existingMapping) {
        return {
          gaToPEOMappings: state.gaToPEOMappings.filter(
            (m) => !(m.gaId === gaId && m.peoId === peoId)
          ),
        };
      } else {
        return {
          gaToPEOMappings: [...state.gaToPEOMappings, { gaId, peoId }],
        };
      }
    }),
  togglePOToPEOMapping: (poId, peoId) =>
    set((state) => {
      const existingMapping = state.poToPEOMappings.find(
        (m) => m.poId === poId && m.peoId === peoId
      );

      if (existingMapping) {
        return {
          poToPEOMappings: state.poToPEOMappings.filter(
            (m) => !(m.poId === poId && m.peoId === peoId)
          ),
        };
      } else {
        return {
          poToPEOMappings: [...state.poToPEOMappings, { poId, peoId }],
        };
      }
    }),
  togglePOToGAMapping: (poId, gaId) =>
    set((state) => {
      const existingMapping = state.poToGAMappings.find(
        (m) => m.poId === poId && m.gaId === gaId
      );

      if (existingMapping) {
        // Remove mapping if it exists
        return {
          poToGAMappings: state.poToGAMappings.filter(
            (m) => !(m.poId === poId && m.gaId === gaId)
          ),
        };
      } else {
        // Add mapping if it doesn't exist
        return {
          poToGAMappings: [...state.poToGAMappings, { poId, gaId }],
        };
      }
    }),
}));
