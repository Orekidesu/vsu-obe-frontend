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

// Overall revision data structure
export interface DepartmentRevisionData {
  program_proposal_id: number;
  version: number;
  revisions: RevisionItem[];
  message: string;
}

// Submit Revisions Payload with all optional sections
export interface SubmitDepartmentRevisionsPayload {
  // Program section
  program?: {
    name: string;
    abbreviation: string;
  };

  // PEOs section
  peos?: Array<{
    id: number | string;
    statement: string;
  }>;

  // PEO to Mission mappings
  peo_mission_mappings?: Array<{
    peo_id: number | string;
    mission_id: number;
  }>;

  // Graduate Attribute to PEO mappings
  ga_peo_mappings?: Array<{
    peo_id: number | string;
    ga_id: number;
  }>;

  // Program Outcomes
  pos?: Array<{
    id: number | string;
    name: string;
    statement: string;
  }>;

  // PO to PEO mappings
  po_peo_mappings?: Array<{
    po_id: number | string;
    peo_id: number | string;
  }>;

  // PO to Graduate Attribute mappings
  po_ga_mappings?: Array<{
    po_id: number | string;
    ga_id: number;
  }>;

  // Curriculum name
  curriculum?: {
    name: string;
  };

  // Course categories
  course_categories?: Array<{
    id: number | string;
    name: string;
    code: string;
  }>;

  // Curriculum courses
  curriculum_courses?: Array<{
    id: number | string;
    course_id: number;
    course_category_id?: number | string;
    category_code?: string;
    semester_id: number;
    unit: string | number;
    course_code?: string;
    course_title?: string;
  }>;

  // Course to PO mappings
  course_po_mappings?: Array<{
    curriculum_course_id: number | string;
    po_id: number | string;
    ied: string[];
  }>;
}
