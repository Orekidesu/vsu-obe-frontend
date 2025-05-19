import { create } from "zustand";
import { transformProposalData } from "./sample-data/data";
import { ProgramProposalResponse } from "@/types/model/ProgramProposal";

// Define the sections that can be revised
export type RevisionSection =
  | "program"
  | "peos"
  | "peo_mission_mappings"
  | "ga_peo_mappings"
  | "pos"
  | "po_peo_mappings"
  | "po_ga_mappings"
  | "curriculum"
  | "course_categories"
  | "curriculum_courses"
  | "course_po_mappings";

export interface PEO {
  id: number;
  statement: string;
}

// Define the store state
interface RevisionState {
  // Original data
  originalData: ProgramProposalResponse | null;

  // Transformed data
  program: {
    name: string;
    abbreviation: string;
  };
  peos: PEO[];
  peo_mission_mappings: Array<{
    peo_id: number;
    mission_id: number;
  }>;
  ga_peo_mappings: Array<{
    peo_id: number;
    ga_id: number;
  }>;
  pos: Array<{
    id: number;
    name: string;
    statement: string;
  }>;
  po_peo_mappings: Array<{
    po_id: number;
    peo_id: number;
  }>;
  po_ga_mappings: Array<{
    po_id: number;
    ga_id: number;
  }>;
  curriculum: {
    name: string;
  };
  course_categories: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  curriculum_courses: Array<{
    id: number;
    course_id: number;
    course_category_id: number;
    category_code: string;
    semester_id: number;
    unit: string;
  }>;
  course_po_mappings: Array<{
    curriculum_course_id: number;
    po_id: number;
    // ied: string[];
    ied: string[];
  }>;

  // Track which sections have been modified
  modifiedSections: Set<RevisionSection>;

  // Actions
  initializeData: (data: ProgramProposalResponse) => void;
  updateProgram: (program: { name: string; abbreviation: string }) => void;

  // PEO actions
  updatePEO: (id: number, statement: string) => void;
  addPEO: (statement: string) => void;
  removePEO: (id: number) => void;

  resetSection: (section: RevisionSection) => void;
  submitRevisions: () => Promise<boolean>;
}

// Create the store
export const useRevisionStore = create<RevisionState>((set, get) => ({
  // Initialize with empty data
  originalData: null,
  program: { name: "", abbreviation: "" },
  peos: [],
  peo_mission_mappings: [],
  ga_peo_mappings: [],
  pos: [],
  po_peo_mappings: [],
  po_ga_mappings: [],
  curriculum: { name: "" },
  course_categories: [],
  curriculum_courses: [],
  course_po_mappings: [],
  modifiedSections: new Set<RevisionSection>(),

  // Initialize data from API response
  initializeData: (data: ProgramProposalResponse) => {
    const transformedData = transformProposalData(data);
    set({
      originalData: data,
      ...transformedData,
      modifiedSections: new Set<RevisionSection>(),
    });
  },

  // Update program details
  updateProgram: (program) => {
    set((state) => {
      // Create a new Set to avoid mutation
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("program");

      return {
        program,
        modifiedSections,
      };
    });
  },
  // Update a PEO
  updatePEO: (id, statement) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("peos");

      const updatedPEOs = state.peos.map((peo) =>
        peo.id === id ? { ...peo, statement } : peo
      );

      return {
        peos: updatedPEOs,
        modifiedSections,
      };
    });
  },

  // Add a new PEO
  addPEO: (statement) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("peos");

      // Generate a temporary ID for the new PEO
      // In a real app, the server would assign a permanent ID
      const newId = Math.max(0, ...state.peos.map((peo) => peo.id)) + 1;

      return {
        peos: [...state.peos, { id: newId, statement }],
        modifiedSections,
      };
    });
  },

  // Remove a PEO
  removePEO: (id) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("peos");

      // Remove the PEO
      const updatedPEOs = state.peos.filter((peo) => peo.id !== id);

      // Also remove any mappings that reference this PEO
      const updatedPEOMissionMappings = state.peo_mission_mappings.filter(
        (mapping) => mapping.peo_id !== id
      );

      const updatedGAPEOMappings = state.ga_peo_mappings.filter(
        (mapping) => mapping.peo_id !== id
      );

      const updatedPOPEOMappings = state.po_peo_mappings.filter(
        (mapping) => mapping.peo_id !== id
      );

      // Update related sections if they've been modified
      if (
        state.peo_mission_mappings.length !== updatedPEOMissionMappings.length
      ) {
        modifiedSections.add("peo_mission_mappings");
      }

      if (state.ga_peo_mappings.length !== updatedGAPEOMappings.length) {
        modifiedSections.add("ga_peo_mappings");
      }

      if (state.po_peo_mappings.length !== updatedPOPEOMappings.length) {
        modifiedSections.add("po_peo_mappings");
      }

      return {
        peos: updatedPEOs,
        peo_mission_mappings: updatedPEOMissionMappings,
        ga_peo_mappings: updatedGAPEOMappings,
        po_peo_mappings: updatedPOPEOMappings,
        modifiedSections,
      };
    });
  },

  // Reset a section to its original state
  resetSection: (section) => {
    set((state) => {
      if (!state.originalData) return state;

      const transformedData = transformProposalData(state.originalData);
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.delete(section);

      // Create a new state object with the reset section
      const newState: Partial<RevisionState> = {
        modifiedSections,
      };

      // Type-safe way to set the correct section data
      switch (section) {
        case "program":
          newState.program = transformedData.program;
          break;
        case "peos":
          newState.peos = transformedData.peos;
          break;
        case "peo_mission_mappings":
          newState.peo_mission_mappings = transformedData.peo_mission_mappings;
          break;
        case "ga_peo_mappings":
          newState.ga_peo_mappings = transformedData.ga_peo_mappings;
          break;
        case "pos":
          newState.pos = transformedData.pos;
          break;
        case "po_peo_mappings":
          newState.po_peo_mappings = transformedData.po_peo_mappings;
          break;
        case "po_ga_mappings":
          newState.po_ga_mappings = transformedData.po_ga_mappings;
          break;
        case "curriculum":
          newState.curriculum = transformedData.curriculum;
          break;
        case "course_categories":
          newState.course_categories = transformedData.course_categories;
          break;
        case "curriculum_courses":
          newState.curriculum_courses = transformedData.curriculum_courses;
          break;
        case "course_po_mappings":
          newState.course_po_mappings = transformedData.course_po_mappings;
          break;
      }

      // If resetting PEOs, also reset related mappings
      if (section === "peos") {
        newState.peo_mission_mappings = transformedData.peo_mission_mappings;
        newState.ga_peo_mappings = transformedData.ga_peo_mappings;

        // Remove these sections from modified sections
        modifiedSections.delete("peo_mission_mappings");
        modifiedSections.delete("ga_peo_mappings");
      }

      return newState as RevisionState;
    });
  },

  // Submit revisions to the API
  submitRevisions: async () => {
    const state = get();
    const { modifiedSections } = state;

    if (modifiedSections.size === 0) {
      console.log("No changes to submit");
      return true;
    }

    // Prepare the data to submit
    const dataToSubmit: Record<string, unknown> = {};
    modifiedSections.forEach((section) => {
      dataToSubmit[section] = state[section];
    });

    console.log("Submitting revisions:", dataToSubmit);

    // Simulate API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  },
}));
