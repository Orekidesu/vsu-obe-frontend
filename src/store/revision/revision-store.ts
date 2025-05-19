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

// Define the store state
interface RevisionState {
  // Original data
  originalData: ProgramProposalResponse | null;

  // Transformed data
  program: {
    name: string;
    abbreviation: string;
  };
  peos: Array<{
    id: number;
    statement: string;
  }>;
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

  // Reset a section to its original state
  resetSection: (section) => {
    set((state) => {
      if (!state.originalData) return state;

      const transformedData = transformProposalData(state.originalData);
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.delete(section);

      return {
        [section]: transformedData[section],
        modifiedSections,
      };
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
