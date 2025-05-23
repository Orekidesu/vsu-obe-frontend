import { StateCreator } from "zustand";
import { WizardState } from "./types";
import { initialCommitteeCourseAssignments } from "./initial-state";

export const createCommitteeSlice: StateCreator<
  WizardState,
  [],
  [],
  Pick<
    WizardState,
    | "committees"
    | "selectedCommittees"
    | "committeeCourseAssignments"
    | "setCommittees" // Add this new action
    | "setSelectedCommittees"
    | "addCommittee"
    | "removeCommittee"
    | "assignCourseToCommittee"
    | "removeCourseAssignment"
    | "getCommitteeForCourse"
  >
> = (set, get) => ({
  committees: [], // Start with empty array instead of initialCommittees
  selectedCommittees: [],
  committeeCourseAssignments: initialCommitteeCourseAssignments,

  // Add new action to set committees from API
  setCommittees: (committees) => {
    set({ committees });
  },

  setSelectedCommittees: (committeeIds) => {
    set({ selectedCommittees: committeeIds.map((id) => id) });
  },

  addCommittee: (committeeId) => {
    set((state) => ({
      selectedCommittees: [...state.selectedCommittees, committeeId],
    }));
  },

  removeCommittee: (committeeId) =>
    set((state) => {
      // Remove any course assignments for this committee
      const updatedCommitteeCourseAssignments =
        state.committeeCourseAssignments.filter(
          (assignment) => assignment.committeeId !== committeeId
        );

      return {
        selectedCommittees: state.selectedCommittees.filter(
          (id) => id !== committeeId
        ),
        committeeCourseAssignments: updatedCommitteeCourseAssignments,
      };
    }),

  // committee course assignment methods
  assignCourseToCommittee: (committeeId, courseId) =>
    set((state) => {
      // Check if this course is already assigned to any committee
      const existingAssignment = state.committeeCourseAssignments.find(
        (assignment) => assignment.courseId === courseId
      );

      if (existingAssignment) {
        // Update the existing assignment
        return {
          committeeCourseAssignments: state.committeeCourseAssignments.map(
            (assignment) =>
              assignment.courseId === courseId
                ? { committeeId, courseId }
                : assignment
          ),
        };
      } else {
        // Add a new assignment
        return {
          committeeCourseAssignments: [
            ...state.committeeCourseAssignments,
            { committeeId, courseId },
          ],
        };
      }
    }),

  removeCourseAssignment: (courseId) =>
    set((state) => ({
      committeeCourseAssignments: state.committeeCourseAssignments.filter(
        (assignment) => assignment.courseId !== courseId
      ),
    })),

  getCommitteeForCourse: (courseId) => {
    const assignment = get().committeeCourseAssignments.find(
      (a) => a.courseId === courseId
    );
    return assignment ? assignment.committeeId : null;
  },
});
