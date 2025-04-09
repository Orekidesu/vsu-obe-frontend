import { create } from "zustand";

interface WizardState {
  formType: string;
  programName: string;
  programAbbreviation: string;
  selectedProgram: string;
  setFormType: (type: string) => void;
  setProgramName: (name: string) => void;
  setProgramAbbreviation: (abbreviation: string) => void;
  setSelectedProgram: (program: string) => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  formType: "",
  programName: "",
  programAbbreviation: "",
  selectedProgram: "",
  setFormType: (type) => set({ formType: type }),
  setProgramName: (name) => set({ programName: name }),
  setProgramAbbreviation: (abbreviation) =>
    set({ programAbbreviation: abbreviation }),
  setSelectedProgram: (program) => set({ selectedProgram: program }),
}));
