import { StateCreator } from "zustand";
import { WizardState } from "./types";

export const createProgramOutcomeSlice: StateCreator<
  WizardState,
  [],
  [],
  Pick<
    WizardState,
    | "programOutcomes"
    | "addProgramOutcome"
    | "updateProgramOutcome"
    | "removeProgramOutcome"
  >
> = (set) => ({
  programOutcomes: [{ id: 1, name: "", statement: "" }], // Start with one empty Program Outcome

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
      // Also remove any course to PO mappings for this PO
      courseToPOMappings: state.courseToPOMappings.filter(
        (mapping) => mapping.poId !== id
      ),
    })),
});
