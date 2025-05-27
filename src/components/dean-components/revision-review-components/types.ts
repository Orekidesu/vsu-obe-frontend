import { ProgramProposalResponse } from "@/types/model/ProgramProposal";

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
export interface RawABCD {
  audience: string;
  behavior: string;
  condition: string;
  degree: string;
}

export interface RawPOMapping {
  po_id: number;
  po_name: string;
  po_statement: string;
  ied: string; // Changed to string to accept any string value
}

export interface RawAssessmentTask {
  id: string | number;
  at_code: string;
  at_name: string;
  at_tool: string;
  weight: string | number;
}

export interface RawTLAMethod {
  id?: number;
  teaching_methods: string[];
  learning_resources: string[];
}

export interface RawCourseOutcome {
  id: number;
  name: string;
  statement: string;
  abcd?: RawABCD;
  cpa?: string;
  po_mappings?: RawPOMapping[];
  tla_tasks?: RawAssessmentTask[];
  tla_assessment_method?: RawTLAMethod;
}

export interface RawCourseCategory {
  id: number;
  name: string;
  code: string;
}

export interface RawSemester {
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

// Transform Program proposal data
export const transformProposalData = (data: ProgramProposalResponse) => {
  if (!data) return null;

  // Extract unique semesters
  const uniqueSemesters = new Map();
  data?.curriculum.courses.forEach((course) => {
    const key = `${course.semester.year}-${course.semester.sem}`;
    if (!uniqueSemesters.has(key)) {
      uniqueSemesters.set(key, {
        year: course.semester.year,
        sem: course.semester.sem,
      });
    }
  });

  // Extract unique categories
  const uniqueCategories = new Map();
  data.curriculum.courses.forEach((course) => {
    const key = course.category.code;
    if (!uniqueCategories.has(key)) {
      uniqueCategories.set(key, {
        name: course.category.name,
        code: course.category.code,
      });
    }
  });

  // Extract unique courses
  const uniqueCourses = new Map();
  data.curriculum.courses.forEach((course) => {
    const key = course.course.code;
    if (!uniqueCourses.has(key)) {
      uniqueCourses.set(key, {
        code: course.course.code,
        descriptive_title: course.course.descriptive_title,
      });
    }
  });

  // Extract unique missions
  const uniqueMissions = new Map();
  data.peos.forEach((peo) => {
    peo.missions.forEach((mission) => {
      if (!uniqueMissions.has(mission.mission_no)) {
        uniqueMissions.set(mission.mission_no, {
          id: mission.mission_no,
          statement: mission.description,
        });
      }
    });
  });

  // Create PEO to Mission mappings
  const peoMissionMappings: { peo_index: number; mission_id: number }[] = [];
  data.peos.forEach((peo, peoIndex) => {
    peo.missions.forEach((mission) => {
      peoMissionMappings.push({
        peo_index: peoIndex,
        mission_id: mission.mission_no,
      });
    });
  });

  // Create GA to PEO mappings
  const gaPeoMappings: { peo_index: number; ga_id: number }[] = [];
  data.peos.forEach((peo, peoIndex) => {
    peo.graduate_attributes.forEach((ga) => {
      gaPeoMappings.push({
        peo_index: peoIndex,
        ga_id: ga.ga_no,
      });
    });
  });

  // Create PO to PEO mappings
  const poPeoMappings: { po_index: number; peo_index: number }[] = [];
  data.pos.forEach((po, poIndex) => {
    po.peos.forEach((peo) => {
      // Find the index of this PEO in the peos array
      const peoIndex = data.peos.findIndex((p) => p.id === peo.id);
      if (peoIndex !== -1) {
        poPeoMappings.push({
          po_index: poIndex,
          peo_index: peoIndex,
        });
      }
    });
  });

  // Create PO to GA mappings
  const poGaMappings: { po_index: number; ga_id: number }[] = [];
  data.pos.forEach((po, poIndex) => {
    po.graduate_attributes.forEach((ga) => {
      poGaMappings.push({
        po_index: poIndex,
        ga_id: ga.ga_no,
      });
    });
  });

  // Create Course to PO mappings
  const coursePOMappings: {
    course_code: string;
    po_code: string;
    ied: string[];
  }[] = [];
  data.curriculum.courses.forEach((course) => {
    course.po_mappings.forEach((mapping) => {
      // Find the PO by ID
      const po = data.pos.find((p) => p.id === mapping.po_id);
      if (po) {
        coursePOMappings.push({
          course_code: course.course.code,
          po_code: po.name,
          ied: mapping.ied,
        });
      }
    });
  });

  // Create curriculum courses
  const curriculumCourses = data.curriculum.courses.map((course) => ({
    course_code: course.course.code,
    category_code: course.category.code,
    semester_year: course.semester.year,
    semester_name: course.semester.sem,
    units: Number.parseFloat(course.units),
  }));

  const committees =
    data.committees?.map((committee) => ({
      id: committee.id.toString(),
      name: `${committee.user.first_name} ${committee.user.last_name}`,
      email: committee.user.email,
      description: `Assigned by ${committee.assigned_by.first_name} ${committee.assigned_by.last_name}`,
    })) || [];

  // Transform committee assignments
  const committeeAssignments: Array<{
    committeeId: string;
    courseId: string;
    isCompleted: boolean;
  }> = [];

  data.committees?.forEach((committee) => {
    committee.assigned_courses.forEach((course) => {
      committeeAssignments.push({
        committeeId: committee.id.toString(),
        courseId: course.course_code,
        isCompleted: course.is_completed || false,
      });
    });
  });

  return {
    program: {
      name: data.program.name,
      abbreviation: data.program.abbreviation,
    },
    peos: data.peos.map((peo) => ({ statement: peo.statement })),
    pos: data.pos.map((po) => ({
      name: po.name,
      statement: po.statement,
    })),
    curriculum: { name: data.curriculum.name },
    semesters: Array.from(uniqueSemesters.values()),
    course_categories: Array.from(uniqueCategories.values()),
    courses: Array.from(uniqueCourses.values()),
    curriculum_courses: curriculumCourses,
    peo_mission_mappings: peoMissionMappings,
    ga_peo_mappings: gaPeoMappings,
    po_peo_mappings: poPeoMappings,
    po_ga_mappings: poGaMappings,
    course_po_mappings: coursePOMappings,
    missions: Array.from(uniqueMissions.values()),
    committees,
    committeeAssignments,
  };
};

export interface TransformedProgramData {
  program: {
    name: string;
    abbreviation: string;
  };
  peos: { statement: string }[];
  pos: { name: string; statement: string }[];
  curriculum: { name: string };
  semesters: { year: number; sem: string }[];
  course_categories: { name: string; code: string }[];
  courses: { code: string; descriptive_title: string }[];
  curriculum_courses: {
    course_code: string;
    category_code: string;
    semester_year: number;
    semester_name: string;
    units: number;
  }[];
  peo_mission_mappings: { peo_index: number; mission_id: number }[];
  ga_peo_mappings: { peo_index: number; ga_id: number }[];
  po_peo_mappings: { po_index: number; peo_index: number }[];
  po_ga_mappings: { po_index: number; ga_id: number }[];
  course_po_mappings: { course_code: string; po_code: string; ied: string[] }[];
  missions: { id: number; statement: string }[];
  committees: {
    id: string;
    name: string;
    email: string;
    description: string;
  }[];
  committeeAssignments: {
    committeeId: string;
    courseId: string;
    isCompleted: boolean;
  }[];
}

// Helper function to get section display name
export const getSectionDisplayName = (sectionKey: string) => {
  const sectionNames: Record<string, string> = {
    program: "Program Details",
    peos: "Program Educational Objectives",
    peo_mission_mappings: "PEO to Mission Mapping",
    ga_peo_mappings: "GA to PEO Mapping",
    po_peo_mappings: "PO to PEO Mapping",
    po_ga_mappings: "PO to GA Mapping",
    pos: "Program Outcomes",
    curriculum: "Curriculum Details",
    course_categories: "Course Categories",
    curriculum_courses: "Curriculum Courses",
    course_po_mappings: "Course to PO Mapping",
    course_outcomes: "Course Outcomes",
    abcd: "ABCD Components",
    cpa: "CPA Classification",
    po_mappings: "PO Mappings",
    tla_tasks: "TLA Assessment Tasks",
    tla_assessment_method: "TLA Methods",
  };
  return sectionNames[sectionKey] || sectionKey;
};
