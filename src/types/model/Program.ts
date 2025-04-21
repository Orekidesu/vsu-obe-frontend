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
        ird: string;
      }>;
    }>;
  };
  proposal: {
    id: number;
    status: string;
    comment: string | null;
    version: number;
    created_at: string;
    updated_at: string;
  };
}
