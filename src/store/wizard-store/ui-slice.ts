import { StateCreator } from "zustand";
import { WizardState } from "./types";

export const createUISlice: StateCreator<
  WizardState,
  [],
  [],
  Pick<WizardState, "currentStep" | "setCurrentStep">
> = (set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
});
