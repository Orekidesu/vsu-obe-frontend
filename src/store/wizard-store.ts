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
interface WizardState {
  formType: string;
  programName: string;
  programAbbreviation: string;
  selectedProgram: string;
  peos: ProgramEducationalObjective[];
  programOutcomes: ProgramOutcome[];
  graduateAttributes: GraduateAttribute[];
  peoToMissionMappings: PEOToMissionMapping[];
  gaToPEOMappings: GAToPEOMapping[];
  poToPEOMappings: POToPEOMapping[];
  poToGAMappings: POToGAMapping[];

  // Add setters for the GAs
  setGraduateAttributes: (graduateAttributes: GraduateAttribute[]) => void;

  setFormType: (type: string) => void;
  setProgramName: (name: string) => void;
  setProgramAbbreviation: (abbreviation: string) => void;
  setSelectedProgram: (program: string) => void;
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

export const useWizardStore = create<WizardState>((set) => ({
  formType: "",
  programName: "",
  programAbbreviation: "",
  selectedProgram: "",
  peos: [{ id: 1, statement: "" }], // Start with one empty PEO
  programOutcomes: [{ id: 1, name: "", statement: "" }], // Start with one empty Program Outcome
  graduateAttributes: defaultGraduateAttributes, // Start with empty array
  // mappings: [],
  peoToMissionMappings: [],
  gaToPEOMappings: [],
  poToPEOMappings: [],
  poToGAMappings: [],

  setGraduateAttributes: (graduateAttributes) => set({ graduateAttributes }),

  setFormType: (type) => set({ formType: type }),
  setProgramName: (name) => set({ programName: name }),
  setProgramAbbreviation: (abbreviation) =>
    set({ programAbbreviation: abbreviation }),
  setSelectedProgram: (program) => set({ selectedProgram: program }),

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
