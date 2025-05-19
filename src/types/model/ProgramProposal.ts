import { Program } from "./Program";

export interface ProgramProposal {
  id: number;
  program: Program;
  abbreviation: string;
  status: string;
  version: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ProgramProposalResponse {
  id: number;
  status: string;
  comment: string | null;
  version: number;
  created_at: string;
  updated_at: string;
  proposed_by: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  program: {
    id: number;
    name: string;
    abbreviation: string;
    department_id: number;
    department_name: string;
    department_abbreviation: string;
    version: number;
    status: string;
  };
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
    }>;
  }>;
  curriculum: {
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
        ied: string[]; // since this is json in database
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
    }>;
  }>;
}
