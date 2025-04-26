import { StateCreator } from "zustand";
import { WizardState } from "./types";
import { initialCommittees } from "./initial-state";

export const createCommitteeSlice: StateCreator<
  WizardState,
  [],
  [],
  Pick<
    WizardState,
    | "committees"
    | "selectedCommittees"
    | "setSelectedCommittees"
    | "addCommittee"
    | "removeCommittee"
  >
> = (set) => ({
  committees: initialCommittees,
  selectedCommittees: [],

  setSelectedCommittees: (committeeIds) => {
    set({ selectedCommittees: committeeIds.map((id) => id) });
  },

  addCommittee: (committeeId) => {
    set((state) => ({
      selectedCommittees: [...state.selectedCommittees, committeeId],
    }));
  },

  removeCommittee: (committeeId) => {
    set((state) => ({
      selectedCommittees: state.selectedCommittees.filter(
        (id) => id !== committeeId
      ),
    }));
  },
});
