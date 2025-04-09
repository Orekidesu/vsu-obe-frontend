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

// Define the Graduate Attribute interface
interface GraduateAttribute {
  id: string;
  statement: string;
}

interface GAToPEOMapping {
  gaId: string;
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

  setFormType: (type: string) => void;
  setProgramName: (name: string) => void;
  setProgramAbbreviation: (abbreviation: string) => void;
  setSelectedProgram: (program: string) => void;
  addPEO: () => void;
  updatePEO: (id: number, statement: string) => void;
  removePEO: (id: number) => void;
  toggleMapping: (peoId: number, missionId: number) => void; // Updated type
  toggleGAToPEOMapping: (gaId: string, peoId: number) => void;
}
// Dummy graduate attributes
const dummyGraduateAttributes: GraduateAttribute[] = [
  {
    id: "GA1",
    statement:
      "Discipline Knowledge: Demonstrate comprehensive understanding of core concepts and principles in the field",
  },
  {
    id: "GA2",
    statement:
      "Problem Solving: Apply analytical thinking to identify, formulate, and solve complex problems",
  },
  {
    id: "GA3",
    statement:
      "Design/Development: Design solutions for complex problems that meet specified needs",
  },
  {
    id: "GA4",
    statement:
      "Investigation: Conduct investigations of complex problems using research-based knowledge",
  },
  {
    id: "GA5",
    statement:
      "Modern Tools: Create, select, and apply appropriate techniques and resources for engineering activities",
  },
  {
    id: "GA6",
    statement:
      "Society & Environment: Understand the impact of professional solutions in societal and environmental contexts",
  },
  {
    id: "GA7",
    statement:
      "Ethics: Apply ethical principles and commit to professional ethics and responsibilities",
  },
  {
    id: "GA8",
    statement:
      "Individual & Team Work: Function effectively as an individual and as a member/leader in diverse teams",
  },
  {
    id: "GA9",
    statement:
      "Communication: Communicate effectively with a range of audiences through various media",
  },
  {
    id: "GA10",
    statement:
      "Project Management: Demonstrate knowledge and understanding of management principles in multidisciplinary environments",
  },
];
export const useWizardStore = create<WizardState>((set) => ({
  formType: "",
  programName: "",
  programAbbreviation: "",
  selectedProgram: "",
  peos: [{ id: 1, statement: "" }], // Start with one empty PEO
  graduateAttributes: dummyGraduateAttributes,
  mappings: [],
  gaToPEOMappings: [],

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
  toggleGAToPEOMapping: (gaId, peoId) =>
    set((state) => {
      const existingMapping = state.gaToPEOMappings.find(
        (m) => m.gaId === gaId && m.peoId === peoId
      );

      if (existingMapping) {
        // Remove mapping if it exists
        return {
          gaToPEOMappings: state.gaToPEOMappings.filter(
            (m) => !(m.gaId === gaId && m.peoId === peoId)
          ),
        };
      } else {
        // Add mapping if it doesn't exist
        return {
          gaToPEOMappings: [...state.gaToPEOMappings, { gaId, peoId }],
        };
      }
    }),
}));
