/**
 * ABCD mapping for a course outcome
 */
export interface ABCD_Mapping {
  audience: string;
  behavior: string;
  condition: string;
  degree: string;
}

/**
 * PO mapping for a course outcome with IED (Introduce, Emphasize, Demonstrate) value
 */
export interface PO_Mapping {
  po_id: number;
  ied: "I" | "E" | "D";
}

/**
 * Assessment task for Teaching, Learning and Assessment (TLA)
 */
export interface AssessmentTask {
  at_code: string;
  at_name: string;
  at_tool: string;
  at_weight: number;
}

/**
 * Teaching methods and learning resources for a course outcome
 */
export interface TLAMethod {
  teaching_methods: string[];
  learning_resources: string[];
}

/**
 * Course outcome with all related data
 */
export interface CourseOutcomeDetail {
  name: string;
  statement: string;
  abcd: ABCD_Mapping;
  cpa: "C" | "P" | "A"; // Cognitive, Psychomotor, Affective
  po_mappings: PO_Mapping[];
  tla_tasks: AssessmentTask[];
  tla_assessment_method: TLAMethod;
}

/**
 * Complete course details payload for submission
 */
export interface CourseDetailsPayload {
  curriculum_course_id: number;
  course_outcomes: CourseOutcomeDetail[];
}

/**
 * API response structure for course details submission
 */
export interface CourseDetailsResponse {
  success: boolean;
  message: string;
  // data?: any;
}

/**
 * Form data structure from the wizard
 */
export interface WizardCourseFormData {
  courseId: number;
  courseCode: string;
  courseTitle: string;
  courseOutcomes: Array<{
    id: number;
    name: string;
    statement: string;
  }>;
  coAbcdMappings: Array<{
    co_id: number;
    audience: string;
    behavior: string;
    condition: string;
    degree: string;
  }>;
  coCpaMappings: Array<{
    courseOutcomeId: number;
    domain: string;
  }>;
  coPoMappings: Array<{
    courseOutcomeId: number;
    programOutcomeId: number;
    contributionLevel: "I" | "E" | "D";
  }>;
  assessmentTasks: Array<{
    id: string;
    courseOutcomeId: number;
    code: string;
    name: string;
    tool: string;
    weight: number;
  }>;
  teachingMethods: Array<{
    id: string;
    name: string;
  }>;
  learningResources: Array<{
    id: string;
    name: string;
  }>;
  coTeachingMethodMappings: Array<{
    courseOutcomeId: number;
    methodIds: string[];
  }>;
  coLearningResourceMappings: Array<{
    courseOutcomeId: number;
    resourceIds: string[];
  }>;
}
