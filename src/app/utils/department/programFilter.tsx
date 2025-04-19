import { Program } from "@/types/model/Program";

/**
 * Filters programs that belong to a specific department
 * @param programs Array of programs to filter
 * @param departmentId The ID of the department to filter by
 * @returns Filtered array of programs
 */
export const filterProgramsByDepartment = (
  programs: Program[] = [],
  departmentId?: number | null
): Program[] => {
  if (!departmentId) return [];
  return programs.filter((program) => program?.department?.id === departmentId);
};

/**
 * Filters active programs for a department
 * @param programs Array of programs to filter
 * @param departmentId The ID of the department to filter by
 * @returns Filtered array of active programs
 */
export const filterActivePrograms = (
  programs: Program[] = [],
  departmentId?: number | null
): Program[] => {
  if (!departmentId) return [];
  return programs.filter(
    (program) =>
      program?.department?.id === departmentId && program.status === "active"
  );
};

/**
 * Gets all program IDs for a department
 * @param programs Array of programs
 * @param departmentId The ID of the department
 * @returns Array of program IDs
 */
export const getDepartmentProgramIds = (
  programs: Program[] = [],
  departmentId?: number | null
): number[] => {
  const departmentPrograms = filterProgramsByDepartment(programs, departmentId);
  return departmentPrograms.map((program) => program.id);
};

/**
 * Gets all programs for a department
 * @param programs Array of all programs
 * @param departmentId The ID of the department
 * @returns Array of programs belonging to the department
 */
export const getDepartmentPrograms = (
  programs: Program[] = [],
  departmentId?: number | null
): Program[] => {
  if (!departmentId) return [];
  return filterProgramsByDepartment(programs, departmentId);
};

/**
 * Filters active programs that don't have matching pending programs in the department
 * @param programs Array of all programs to filter
 * @param departmentId The ID of the department to filter by
 * @returns Filtered array of active programs with no pending counterparts
 */
export const filterActiveNoPendingPrograms = (
  programs: Program[] = [],
  departmentId?: number | null
): Program[] => {
  if (!departmentId) return [];

  // Step 1: Get all active programs in the department
  const activePrograms = programs.filter(
    (program) =>
      program?.department?.id === departmentId && program.status === "active"
  );

  // Step 2: Get all pending programs in the department
  const pendingPrograms = programs.filter(
    (program) =>
      program?.department?.id === departmentId && program.status === "pending"
  );

  // Step 3: Filter active programs that don't have a matching pending program
  return activePrograms.filter((activeProgram) => {
    // Check if there's no pending program with the same name
    return !pendingPrograms.some(
      (pendingProgram) => pendingProgram.name === activeProgram.name
    );
  });
};
