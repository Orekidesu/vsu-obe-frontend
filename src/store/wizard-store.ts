import { create } from "zustand";
import { GraduateAttribute } from "@/types/model/GraduateAttributes";

// Define the PEO interface
interface PEO {
  id: number;
  statement: string;
}

// Define the Mapping interface
interface Mapping {
  peoId: number;
  missionId: number;
}

interface GAToPEOMapping {
  gaId: string; // Keep as string for compatibility with existing mappings
  peoId: number;
}

interface WizardState {
  formType: string;
  programName: string;
  programAbbreviation: string;
  selectedProgram: string;
  peos: PEO[];
  graduateAttributes: GraduateAttribute[];
  mappings: Mapping[];
  gaToPEOMappings: GAToPEOMapping[];

  // Add setters for the GAs
  setGraduateAttributes: (graduateAttributes: GraduateAttribute[]) => void;

  setFormType: (type: string) => void;
  setProgramName: (name: string) => void;
  setProgramAbbreviation: (abbreviation: string) => void;
  setSelectedProgram: (program: string) => void;
  addPEO: () => void;
  updatePEO: (id: number, statement: string) => void;
  removePEO: (id: number) => void;
  toggleMapping: (peoId: number, missionId: number) => void;
  toggleGAToPEOMapping: (gaId: string, peoId: number) => void;
}

// Default empty array for graduate attributes (will be replaced by fetched data)
const defaultGraduateAttributes: GraduateAttribute[] = [];

export const useWizardStore = create<WizardState>((set) => ({
  formType: "",
  programName: "",
  programAbbreviation: "",
  selectedProgram: "",
  peos: [{ id: 1, statement: "" }], // Start with one empty PEO
  graduateAttributes: defaultGraduateAttributes, // Start with empty array
  mappings: [],
  gaToPEOMappings: [],

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
      mappings: state.mappings.filter((mapping) => mapping.peoId !== id),
      gaToPEOMappings: state.gaToPEOMappings.filter(
        (mapping) => mapping.peoId !== id
      ),
    })),

  toggleMapping: (peoId, missionId) =>
    set((state) => {
      const existingMapping = state.mappings.find(
        (m) => m.peoId === peoId && m.missionId === missionId
      );

      if (existingMapping) {
        return {
          mappings: state.mappings.filter(
            (m) => !(m.peoId === peoId && m.missionId === missionId)
          ),
        };
      } else {
        return {
          mappings: [...state.mappings, { peoId, missionId }],
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
}));
