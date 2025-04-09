import { create } from "zustand";
// import { Mission } from "@/types/model/Mission";

// Define the PEO interface
interface PEO {
  id: number;
  statement: string;
}

// Define the Mapping interface
interface Mapping {
  peoId: number;
  missionId: number; // Changed to number to match Mission.id type
}

interface WizardState {
  formType: string;
  programName: string;
  programAbbreviation: string;
  selectedProgram: string;
  peos: PEO[];
  mappings: Mapping[];
  setFormType: (type: string) => void;
  setProgramName: (name: string) => void;
  setProgramAbbreviation: (abbreviation: string) => void;
  setSelectedProgram: (program: string) => void;
  addPEO: () => void;
  updatePEO: (id: number, statement: string) => void;
  removePEO: (id: number) => void;
  toggleMapping: (peoId: number, missionId: number) => void; // Updated type
}

export const useWizardStore = create<WizardState>((set) => ({
  formType: "",
  programName: "",
  programAbbreviation: "",
  selectedProgram: "",
  peos: [{ id: 1, statement: "" }], // Start with one empty PEO
  mappings: [],

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
    })),

  toggleMapping: (peoId, missionId) =>
    set((state) => {
      const existingMapping = state.mappings.find(
        (m) => m.peoId === peoId && m.missionId === missionId
      );

      if (existingMapping) {
        // Remove mapping if it exists
        return {
          mappings: state.mappings.filter(
            (m) => !(m.peoId === peoId && m.missionId === missionId)
          ),
        };
      } else {
        // Add mapping if it doesn't exist
        return {
          mappings: [...state.mappings, { peoId, missionId }],
        };
      }
    }),
}));
