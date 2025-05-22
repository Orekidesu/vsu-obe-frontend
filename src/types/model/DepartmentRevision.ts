// Section types for revisions
export type RevisionSectionType =
  | "program"
  | "peos"
  | "peo_mission_mappings"
  | "ga_peo_mappings"
  | "pos"
  | "po_peo_mappings"
  | "po_ga_mappings"
  | "curriculum"
  | "course_categories"
  | "curriculum_courses"
  | "course_po_mappings";

// Individual revision item
export interface RevisionItem {
  id: number;
  section: RevisionSectionType;
  details: string;
  created_at: string;
  version: number;
}

// Overall revision data structure
export interface DepartmentRevisionData {
  program_proposal_id: number;
  version: number;
  revisions: RevisionItem[];
  message: string;
}
