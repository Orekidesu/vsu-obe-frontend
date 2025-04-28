export interface FullProgramProposalPayload {
  program: {
    name: string;
    abbreviation: string;
  };
  peos: Array<{ statement: string }>;
  peo_mission_mappings: Array<{ peo_index: number; mission_id: number }>;
  ga_peo_mappings: Array<{ peo_index: number; ga_id: number }>;
  pos: Array<{ name: string; statement: string }>;
  po_peo_mappings: Array<{ po_index: number; peo_index: number }>;
  po_ga_mappings: Array<{ po_index: number; ga_id: number }>;
  curriculum: { name: string };
  semesters: Array<{ year: number; sem: string }>;
  course_categories: Array<{ name: string; code: string }>;
  courses: Array<{ code: string; descriptive_title: string }>;
  curriculum_courses: Array<{
    course_code: string;
    category_code: string;
    semester_year: number;
    semester_name: string;
    units: number;
  }>;
  course_po_mappings: Array<{
    course_code: string;
    po_code: string;
    ird: string[];
  }>;
  committees: Array<{ user_id: number }>;
  committee_course_assignments: Array<{
    user_id: number;
    course_codes: string[];
  }>;
}

/**
 * This is the structure for wizard form data that gets transformed into the payload
 */
export interface WizardFormData {
  programName: string;
  programAbbreviation: string;
  peos: Array<{ id: string; statement: string }>;
  programOutcomes: Array<{ id: string; name: string; statement: string }>;
  peoToMissionMappings: Array<{ peoId: string; missionId: number }>;
  gaToPEOMappings: Array<{ peoId: string; gaId: number }>;
  poToPEOMappings: Array<{ poId: string; peoId: string }>;
  poToGAMappings: Array<{ poId: string; gaId: number }>;
  curriculumName: string;
  yearSemesters: Array<{ id: string; year: number; semester: string }>;
  courseCategories: Array<{ id: string; name: string; code: string }>;
  curriculumCourses: Array<{
    id: string;
    code: string;
    title: string;
    yearSemesterId: string;
    categoryId: string;
    units: number;
  }>;
  courseToPOMappings: Array<{
    courseId: string;
    poId: string;
    contributionLevels: string[];
  }>;
  selectedCommittees: number[];
  committeeCourseAssignments: Array<{
    committeeId: number;
    courseId: string;
  }>;
}
