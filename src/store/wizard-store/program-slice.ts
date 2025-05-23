import { StateCreator } from "zustand";
import { WizardState } from "./types";

export const createProgramSlice: StateCreator<
  WizardState,
  [],
  [],
  Pick<
    WizardState,
    | "formType"
    | "programName"
    | "programAbbreviation"
    | "selectedProgram"
    | "setFormType"
    | "setProgramName"
    | "setProgramAbbreviation"
    | "setSelectedProgram"
  >
> = (set) => ({
  formType: "",
  programName: "",
  programAbbreviation: "",
  selectedProgram: "",

  setFormType: (type) => set({ formType: type }),
  setProgramName: (name) => set({ programName: name }),
  setProgramAbbreviation: (abbreviation) =>
    set({ programAbbreviation: abbreviation }),
  setSelectedProgram: (program) => set({ selectedProgram: program }),
});
