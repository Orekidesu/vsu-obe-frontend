import {
  CourseOutcome,
  CO_ABCD_Mapping,
  CO_CPA_Mapping,
  CO_PO_Mapping,
  AssessmentTask,
  TeachingMethod,
  LearningResource,
  ProgramOutcome,
} from "@/store/course/course-store";

// Define the types for the raw course data from API
interface RawABCD {
  audience: string;
  behavior: string;
  condition: string;
  degree: string;
}

interface RawPOMapping {
  po_id: number;
  po_name: string;
  po_statement: string;
  ied: string; // Changed to string to accept any string value
}

interface RawAssessmentTask {
  id: string | number;
  at_code: string;
  at_name: string;
  at_tool: string;
  weight: string | number;
}

interface RawTLAMethod {
  id?: number;
  teaching_methods: string[];
  learning_resources: string[];
}

interface RawCourseOutcome {
  id: number;
  name: string;
  statement: string;
  abcd?: RawABCD;
  cpa?: string;
  po_mappings?: RawPOMapping[];
  tla_tasks?: RawAssessmentTask[];
  tla_assessment_method?: RawTLAMethod;
}

interface RawCourseCategory {
  id: number;
  name: string;
  code: string;
}

interface RawSemester {
  id: number;
  year: number;
  sem: string;
}

// Updated to match the actual course data structure
interface RawCourseData {
  id: number;
  curriculum: {
    id: number;
    name: string;
  };
  course: {
    id: number;
    code: string;
    descriptive_title: string;
  };
  course_category: RawCourseCategory;
  semester: RawSemester;
  units: string;
  is_in_revision: boolean;
  is_completed: boolean;
  course_outcomes?: RawCourseOutcome[];
}

// Define the return type for the transformer
interface TransformedCourseData {
  courseOutcomes: CourseOutcome[];
  abcdMappings: CO_ABCD_Mapping[];
  cpaMappings: CO_CPA_Mapping[];
  poMappings: CO_PO_Mapping[];
  programOutcomes: ProgramOutcome[];
  assessmentTasks: AssessmentTask[];
  teachingMethods: TeachingMethod[];
  learningResources: LearningResource[];
}

/**
 * Transforms raw course data from API to formatted data for components
 */
export const transformCourseData = (
  courseData: RawCourseData | null | undefined
): TransformedCourseData => {
  if (!courseData || !courseData.course_outcomes) {
    return {
      courseOutcomes: [],
      abcdMappings: [],
      cpaMappings: [],
      poMappings: [],
      programOutcomes: [],
      assessmentTasks: [],
      teachingMethods: [],
      learningResources: [],
    };
  }

  // Transform course outcomes
  const courseOutcomes: CourseOutcome[] = courseData.course_outcomes.map(
    (outcome) => ({
      id: outcome.id,
      name: outcome.name,
      statement: outcome.statement,
    })
  );

  // Transform ABCD mappings
  const abcdMappings: CO_ABCD_Mapping[] = courseData.course_outcomes
    .filter((outcome) => outcome.abcd)
    .map((outcome) => ({
      co_id: outcome.id,
      audience: outcome.abcd?.audience || "",
      behavior: outcome.abcd?.behavior || "",
      condition: outcome.abcd?.condition || "",
      degree: outcome.abcd?.degree || "",
    }));

  // Transform CPA mappings
  const cpaMappings: CO_CPA_Mapping[] = courseData.course_outcomes
    .filter((outcome) => outcome.cpa)
    .map((outcome) => {
      // Map the string CPA value to the enum type
      let domain: "cognitive" | "psychomotor" | "affective" | null = null;
      if (outcome.cpa === "cognitive" || outcome.cpa === "C") {
        domain = "cognitive";
      } else if (outcome.cpa === "psychomotor" || outcome.cpa === "P") {
        domain = "psychomotor";
      } else if (outcome.cpa === "affective" || outcome.cpa === "A") {
        domain = "affective";
      }

      return {
        courseOutcomeId: outcome.id,
        domain,
      };
    });

  // Transform PO mappings
  const poMappings: CO_PO_Mapping[] = courseData.course_outcomes.flatMap(
    (outcome) =>
      (outcome.po_mappings || []).map((mapping) => {
        // Validate and convert ied to proper type
        let contributionLevel: "I" | "E" | "D" = "I"; // Default to "I"
        const upperIed = mapping.ied.toUpperCase();
        if (upperIed === "I" || upperIed === "E" || upperIed === "D") {
          contributionLevel = upperIed as "I" | "E" | "D";
        }

        return {
          courseOutcomeId: outcome.id,
          programOutcomeId: mapping.po_id,
          contributionLevel,
        };
      })
  );

  // Transform program outcomes (for reference)
  const programOutcomesMap = new Map<number, ProgramOutcome>();
  courseData.course_outcomes.forEach((outcome) => {
    (outcome.po_mappings || []).forEach((mapping) => {
      if (!programOutcomesMap.has(mapping.po_id)) {
        programOutcomesMap.set(mapping.po_id, {
          id: mapping.po_id,
          name: mapping.po_name,
          statement: mapping.po_statement,
          availableContributionLevels: ["I", "E", "D"], // Default to all levels
        });
      }
    });
  });

  const programOutcomes: ProgramOutcome[] = Array.from(
    programOutcomesMap.values()
  );

  // Transform assessment tasks
  const assessmentTasks: AssessmentTask[] = courseData.course_outcomes.flatMap(
    (outcome) =>
      (outcome.tla_tasks || []).map((task) => ({
        id: typeof task.id === "string" ? task.id : String(task.id),
        courseOutcomeId: outcome.id,
        code: task.at_code,
        name: task.at_name,
        tool: task.at_tool,
        weight:
          typeof task.weight === "string"
            ? parseFloat(task.weight)
            : task.weight,
      }))
  );

  // Transform teaching methods and learning resources
  const teachingMethodsSet = new Set<string>();
  const learningResourcesSet = new Set<string>();

  courseData.course_outcomes.forEach((outcome) => {
    if (outcome.tla_assessment_method) {
      (outcome.tla_assessment_method.teaching_methods || []).forEach(
        (method) => {
          teachingMethodsSet.add(method);
        }
      );

      (outcome.tla_assessment_method.learning_resources || []).forEach(
        (resource) => {
          learningResourcesSet.add(resource);
        }
      );
    }
  });

  const teachingMethods: TeachingMethod[] = Array.from(teachingMethodsSet).map(
    (method, index) => ({
      id: `tm-${index}`,
      name: method,
    })
  );

  const learningResources: LearningResource[] = Array.from(
    learningResourcesSet
  ).map((resource, index) => ({
    id: `lr-${index}`,
    name: resource,
  }));

  // Return all transformed data
  return {
    courseOutcomes,
    abcdMappings,
    cpaMappings,
    poMappings,
    programOutcomes,
    assessmentTasks,
    teachingMethods,
    learningResources,
  };
};
