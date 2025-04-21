import { StateCreator } from "zustand";
import { WizardState } from "./types";

export const createMappingSlice: StateCreator<
  WizardState,
  [],
  [],
  Pick<
    WizardState,
    | "peoToMissionMappings"
    | "gaToPEOMappings"
    | "poToPEOMappings"
    | "poToGAMappings"
    | "toggleMapping"
    | "toggleGAToPEOMapping"
    | "togglePOToPEOMapping"
    | "togglePOToGAMapping"
  >
> = (set) => ({
  peoToMissionMappings: [],
  gaToPEOMappings: [],
  poToPEOMappings: [],
  poToGAMappings: [],

  toggleMapping: (peoId, missionId) =>
    set((state) => {
      const existingMapping = state.peoToMissionMappings.find(
        (m) => m.peoId === peoId && m.missionId === missionId
      );

      if (existingMapping) {
        return {
          peoToMissionMappings: state.peoToMissionMappings.filter(
            (m) => !(m.peoId === peoId && m.missionId === missionId)
          ),
        };
      } else {
        return {
          peoToMissionMappings: [
            ...state.peoToMissionMappings,
            { peoId, missionId },
          ],
        };
      }
    }),

  toggleGAToPEOMapping: (gaId, peoId) =>
    set((state) => {
      const existingMapping = state.gaToPEOMappings.find(
        (m) => m.gaId === gaId && m.peoId === peoId
      );

      if (existingMapping) {
        return {
          gaToPEOMappings: state.gaToPEOMappings.filter(
            (m) => !(m.gaId === gaId && m.peoId === peoId)
          ),
        };
      } else {
        return {
          gaToPEOMappings: [...state.gaToPEOMappings, { gaId, peoId }],
        };
      }
    }),

  togglePOToPEOMapping: (poId, peoId) =>
    set((state) => {
      const existingMapping = state.poToPEOMappings.find(
        (m) => m.poId === poId && m.peoId === peoId
      );

      if (existingMapping) {
        return {
          poToPEOMappings: state.poToPEOMappings.filter(
            (m) => !(m.poId === poId && m.peoId === peoId)
          ),
        };
      } else {
        return {
          poToPEOMappings: [...state.poToPEOMappings, { poId, peoId }],
        };
      }
    }),

  togglePOToGAMapping: (poId, gaId) =>
    set((state) => {
      const existingMapping = state.poToGAMappings.find(
        (m) => m.poId === poId && m.gaId === gaId
      );

      if (existingMapping) {
        return {
          poToGAMappings: state.poToGAMappings.filter(
            (m) => !(m.poId === poId && m.gaId === gaId)
          ),
        };
      } else {
        return {
          poToGAMappings: [...state.poToGAMappings, { poId, gaId }],
        };
      }
    }),
});
