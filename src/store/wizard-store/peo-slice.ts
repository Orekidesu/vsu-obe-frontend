import { StateCreator } from "zustand";
import { WizardState } from "./types";

export const createPEOSlice: StateCreator<
  WizardState,
  [],
  [],
  Pick<WizardState, "peos" | "addPEO" | "updatePEO" | "removePEO">
> = (set) => ({
  peos: [{ id: 1, statement: "" }], // Start with one empty PEO

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
      peoToMissionMappings: state.peoToMissionMappings.filter(
        (mapping) => mapping.peoId !== id
      ),
      gaToPEOMappings: state.gaToPEOMappings.filter(
        (mapping) => mapping.peoId !== id
      ),
    })),
});
