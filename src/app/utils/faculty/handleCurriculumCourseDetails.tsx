import { toast } from "@/hooks/use-toast";
import { UseMutationResult } from "@tanstack/react-query";
import { APIError, handleMutationError } from "../errorHandler";
import {
  CourseDetailsPayload,
  CourseDetailsResponse,
  WizardCourseFormData,
} from "./curriculumCourseDetailsPayload";

/**
 * Handle submitting the full curriculum course details
 */
export const submitCurriculumCourseDetailsHandler = async (
  submitMutation: UseMutationResult<
    CourseDetailsResponse,
    APIError,
    CourseDetailsPayload,
    unknown
  >,
  data: CourseDetailsPayload,
  setFormError?: (error: Record<string, string[]> | string | null) => void
): Promise<CourseDetailsResponse | null> => {
  return new Promise<CourseDetailsResponse | null>((resolve, reject) => {
    submitMutation.mutate(data, {
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to submit course details. Please try again.",
          variant: "destructive",
        });

        if (setFormError) {
          handleMutationError(
            error,
            "Failed to submit course details",
            setFormError
          );
        }

        reject(error);
      },
      onSuccess: (response) => {
        toast({
          title: "Success!",
          description:
            response.message || "Course details submitted successfully",
          variant: "success",
        });

        if (setFormError) {
          setFormError(null);
        }

        resolve(response);
      },
    });
  });
};

/**
 * Transform wizard form data to API payload format
 */
export const createCurriculumCourseDetailsPayload = (
  formData: WizardCourseFormData
): CourseDetailsPayload => {
  const {
    courseId,
    courseOutcomes,
    coAbcdMappings,
    coCpaMappings,
    coPoMappings,
    assessmentTasks,
    teachingMethods,
    learningResources,
    coTeachingMethodMappings,
    coLearningResourceMappings,
  } = formData;

  return {
    curriculum_course_id: courseId,
    course_outcomes: courseOutcomes.map((co) => {
      // Find associated mappings for this CO
      const abcdMapping = coAbcdMappings.find(
        (mapping) => mapping.co_id === co.id
      );
      const cpaMapping = coCpaMappings.find(
        (mapping) => mapping.courseOutcomeId === co.id
      );
      const poMappings = coPoMappings.filter(
        (mapping) => mapping.courseOutcomeId === co.id
      );
      const tasks = assessmentTasks.filter(
        (task) => task.courseOutcomeId === co.id
      );

      // Get teaching methods and learning resources for this CO
      const teachingMethodIds =
        coTeachingMethodMappings.find(
          (mapping) => mapping.courseOutcomeId === co.id
        )?.methodIds || [];

      const learningResourceIds =
        coLearningResourceMappings.find(
          (mapping) => mapping.courseOutcomeId === co.id
        )?.resourceIds || [];

      // Get the names of teaching methods and learning resources
      const teachingMethodNames = teachingMethodIds
        .map((id) => teachingMethods.find((m) => m.id === id)?.name || "")
        .filter((name) => name !== "");

      const learningResourceNames = learningResourceIds
        .map((id) => learningResources.find((r) => r.id === id)?.name || "")
        .filter((name) => name !== "");

      return {
        name: co.name,
        statement: co.statement,
        abcd: {
          audience: abcdMapping?.audience || "",
          behavior: abcdMapping?.behavior || "",
          condition: abcdMapping?.condition || "",
          degree: abcdMapping?.degree || "",
        },
        cpa: (cpaMapping?.domain?.charAt(0).toUpperCase() || "C") as
          | "C"
          | "P"
          | "A",
        po_mappings: poMappings.map((mapping) => ({
          po_id: mapping.programOutcomeId,
          ied: mapping.contributionLevel,
        })),
        tla_tasks: tasks.map((task) => ({
          at_code: task.code,
          at_name: task.name,
          at_tool: task.tool,
          at_weight: task.weight,
        })),
        tla_assessment_method: {
          teaching_methods: teachingMethodNames,
          learning_resources: learningResourceNames,
        },
      };
    }),
  };
};

/**
 * Validate the course details form data
 * @returns Validation errors or null if validation passed
 */
export const validateCourseDetails = (
  formData: WizardCourseFormData
): Record<string, string[]> | null => {
  const errors: Record<string, string[]> = {};

  // Validate course outcomes
  if (!formData.courseOutcomes || formData.courseOutcomes.length === 0) {
    errors.courseOutcomes = ["At least one course outcome is required"];
  }

  // Validate each course outcome
  formData.courseOutcomes.forEach((co, index) => {
    // Check if CO has at least one PO mapping
    const coPoMappings = formData.coPoMappings.filter(
      (mapping) => mapping.courseOutcomeId === co.id
    );

    if (coPoMappings.length === 0) {
      errors[`courseOutcome[${index}].poMappings`] = [
        "Each course outcome must be mapped to at least one program outcome",
      ];
    }

    // Check if CO has at least one assessment task
    const coTasks = formData.assessmentTasks.filter(
      (task) => task.courseOutcomeId === co.id
    );

    if (coTasks.length === 0) {
      errors[`courseOutcome[${index}].assessmentTasks`] = [
        "Each course outcome must have at least one assessment task",
      ];
    }

    // Check if total weight of CO assessment tasks is 100%
    const totalWeight = coTasks.reduce((sum, task) => sum + task.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      // Allow small floating point errors
      errors[`courseOutcome[${index}].assessmentTasksWeight`] = [
        `Total weight of assessment tasks must be 100%. Current: ${totalWeight}%`,
      ];
    }

    // Check teaching methods and learning resources
    const teachingMethodIds =
      formData.coTeachingMethodMappings.find(
        (mapping) => mapping.courseOutcomeId === co.id
      )?.methodIds || [];

    const learningResourceIds =
      formData.coLearningResourceMappings.find(
        (mapping) => mapping.courseOutcomeId === co.id
      )?.resourceIds || [];

    if (teachingMethodIds.length === 0) {
      errors[`courseOutcome[${index}].teachingMethods`] = [
        "Each course outcome must have at least one teaching method",
      ];
    }

    if (learningResourceIds.length === 0) {
      errors[`courseOutcome[${index}].learningResources`] = [
        "Each course outcome must have at least one learning resource",
      ];
    }
  });

  return Object.keys(errors).length > 0 ? errors : null;
};
