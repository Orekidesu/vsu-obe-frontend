import { Department } from "./Department";

export interface Program {
  id: number;
  department: Department;
  name: string;
  abbreviation: string;
  status: string;
  version: number;
  updated_at: string;
}

export interface ProgramResponse {
  id: number;
  name: string;
  abbreviation: string;
  status: string;
  version: number;
  department: {
    id: number;
    name: string;
    abbreviation: string;
    faculty: {
      id: number;
      name: string;
      abbreviation: string;
    };
  };
  updated_at: string;
  created_at: string;
  peos: Array<{
    id: number;
    statement: string;
    missions: Array<{
      id: number;
      mission_no: number;
      description: string;
    }>;
    graduate_attributes: Array<{
      id: number;
      ga_no: number;
      name: string;
      description: string;
    }>;
  }>;
  pos: Array<{
    id: number;
    name: string;
    statement: string;
    peos: Array<{
      id: number;
      statement: string;
    }>;
    graduate_attributes: Array<{
      id: number;
      ga_no: number;
      name: string;
      description: string;
    }>;
  }>;
  curriculum: null | {
    // Your existing curriculum structure, seems to be null in this response
    id: number;
    name: string;
    courses: Array<{
      id: number;
      course: {
        id: number;
        code: string;
        descriptive_title: string;
      };
      category: {
        id: number;
        name: string;
        code: string;
      };
      semester: {
        id: number;
        year: number;
        sem: string;
      };
      units: string;
      po_mappings: Array<{
        po_id: number;
        po_name: string;
        ied: string;
      }>;
    }>;
  };
  committees: Array<{
    id: number;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
    assigned_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    assigned_courses: Array<{
      curriculum_course_id: number;
      course_code: string;
      descriptive_title: string;
      is_completed: boolean;
      is_in_revision: boolean;
    }>;
  }>;
  proposal: {
    id: number;
    status: string;
    comment: string | null;
    version: number;
    created_at: string;
    updated_at: string;
  };
  // meta: {
  //   total_pending: number;
  //   total_active: number;
  //   total_archived: number;
  // };
}
