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
