"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CourseOutcome,
  useCourseDetailsStore,
} from "@/store/course/course-store";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

import { CourseOutcomesStep } from "@/components/committee-components/form-steps/CourseOutcome";
import useCurriculumCourses from "@/hooks/faculty-member/useCourseCurriculum";
import useCoursePO from "@/hooks/shared/useCoursePO";
import {
  createCurriculumCourseDetailsPayload,
  submitCurriculumCourseDetailsHandler,
} from "@/app/utils/faculty/handleCurriculumCourseDetails";

import { CourseOutcomesABCDStep } from "./form-steps/CourseOutcomeABCD";
import { CourseOutcomesCPAStep } from "./form-steps/CourseOutcomeCPA";
import { CourseOutcomesPOStep } from "./form-steps/CourseOutcomeToPO";
import { CourseOutcomesTLAStep } from "./form-steps/CourseOutcomeTLA";
import { CourseOutcomesTLStep } from "./form-steps/CourseOutcomeTMLR";
import { CourseOutcomesReviewStep } from "./form-steps/CourseOutcomeReviewStep";

interface WizardFormCourseProps {
  courseId: string;
}

export function WizardFormCourse({ courseId }: WizardFormCourseProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<
    Record<string, string[]> | string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { curriculumCourses, isLoading } = useCurriculumCourses();
  const { submitFullCurriculumCourseDetails } = useCurriculumCourses();
  const { coursePOs, isLoading: poLoading } = useCoursePO(
    parseInt(courseId, 10)
  );

  const {
    courseCode,
    courseTitle,
    courseOutcomes,
    programOutcomes,
    coAbcdMappings,
    coCpaMappings,
    coPoMappings,
    // coTLMappings,
    assessmentTasks,
    teachingMethods,
    learningResources,

    currentStep,

    setCourseInfo,
    setCurrentStep,

    addCourseOutcome,
    addAssessmentTask,
    addTeachingMethod,
    addLearningResource,

    updateCourseOutcome,
    updateCOTeachingMethods,
    updateCOLearningResources,

    removeCourseOutcome,
    removeAssessmentTask,
    removeTeachingMethod,
    removeLearningResource,

    updateCourseOutcomeABCD,
    updateCourseOutcomeCPA,
    updateCourseOutcomePO,
    updateAssessmentTask,

    getABCDMappingForCO,
    getCPAMappingForCO,
    getPOMappingsForCO,
    getAssessmentTasksForCO,
    getTotalAssessmentWeight,
    getCOTeachingMethods,
    getCOLearningResources,

    setProgramOutcomes,
    resetStore,
  } = useCourseDetailsStore();

  // Initialize course information when component mounts
  useEffect(() => {
    if (!isLoading && curriculumCourses) {
      const course = curriculumCourses.find(
        (c) => c.id.toString() === courseId
      );
      if (course) {
        setCourseInfo(
          courseId,
          course.course.code,
          course.course.descriptive_title
        );
      }
    }
  }, [courseId, curriculumCourses, isLoading, setCourseInfo]);

  // Initialize program outcomes from API
  useEffect(() => {
    if (!poLoading && coursePOs && coursePOs.length > 0) {
      // Transform the API response to match our ProgramOutcome interface
      const formattedPOs = coursePOs.map((po) => ({
        id: po.id,
        name: po.name || `PO${po.id}`,
        statement: po.statement,
        availableContributionLevels: po.ied as ("I" | "E" | "D")[],
      }));

      setProgramOutcomes(formattedPOs);
    }
  }, [poLoading, coursePOs, setProgramOutcomes]);

  // Calculate progress percentage based on total steps
  const totalSteps = 7; // Currently only one step, will expand later
  const progressValue = (currentStep / totalSteps) * 100;

  // Validation function to check if B, C, and D are in the CO statement
  const validateABCD = (
    outcome: CourseOutcome,
    behavior: string,
    condition: string,
    degree: string
  ): boolean => {
    if (!outcome.statement) return false;

    // Check if each component is present in the statement
    const statementLower = outcome.statement.toLowerCase();
    const behaviorPresent =
      behavior && statementLower.includes(behavior.toLowerCase());
    const conditionPresent =
      condition && statementLower.includes(condition.toLowerCase());
    const degreePresent =
      degree && statementLower.includes(degree.toLowerCase());

    // Check for overlap between components
    const hasOverlap = (a: string, b: string): boolean => {
      if (!a || !b) return false;
      return (
        a.toLowerCase() === b.toLowerCase() ||
        a.toLowerCase().includes(b.toLowerCase()) ||
        b.toLowerCase().includes(a.toLowerCase())
      );
    };

    const noOverlap =
      !hasOverlap(behavior, condition) &&
      !hasOverlap(behavior, degree) &&
      !hasOverlap(condition, degree);

    return Boolean(
      behaviorPresent && conditionPresent && degreePresent && noOverlap
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Go back to the courses page
      router.push("/faculty/courses");
    }
  };

  // const handleSubmit = () => {
  //   // In a real app, you would save the data to your backend
  //   console.log("Submitting course details:", {
  //     courseId,
  //     courseCode,
  //     courseTitle,
  //     courseOutcomes,
  //     coAbcdMappings,
  //     coCpaMappings,
  //     coPoMappings,
  //     coTLMappings,
  //     assessmentTasks,
  //     teachingMethods,
  //     learningResources,
  //   });

  //   // Show success message
  //   alert("Course details saved successfully!");

  //   resetStore();
  //   router.push("/faculty/courses");
  // };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Make sure all necessary type conversions are handled:

      // 1. Convert courseId to number
      const numericCourseId = parseInt(courseId, 10);

      // 2. Ensure no null values in coCpaMappings.domain
      const sanitizedCpaMappings = coCpaMappings.map((mapping) => ({
        courseOutcomeId: mapping.courseOutcomeId,
        domain: mapping.domain || "cognitive", // Provide default value if null
      }));

      // 3. Create proper teaching methods and learning resources mappings
      const teachingMethodMappings = courseOutcomes.map((co) => ({
        courseOutcomeId: co.id,
        methodIds: getCOTeachingMethods(co.id),
      }));

      const learningResourceMappings = courseOutcomes.map((co) => ({
        courseOutcomeId: co.id,
        resourceIds: getCOLearningResources(co.id),
      }));

      // Create the sanitized form data object
      const safeFormData = {
        courseId: numericCourseId,
        courseCode,
        courseTitle,
        courseOutcomes,
        coAbcdMappings,
        coCpaMappings: sanitizedCpaMappings,
        coPoMappings,
        assessmentTasks,
        teachingMethods,
        learningResources,
        coTeachingMethodMappings: teachingMethodMappings,
        coLearningResourceMappings: learningResourceMappings,
      };

      // Transform the data to the expected API payload format
      const payload = createCurriculumCourseDetailsPayload(safeFormData);

      // Log the formatted payload for debugging
      console.log("API Payload:", payload);

      // Use the handler to submit the payload
      await submitCurriculumCourseDetailsHandler(
        submitFullCurriculumCourseDetails,
        payload,
        setFormError
      );

      // Reset store and navigate on success
      resetStore();
      router.push("/faculty/courses");
    } catch (error) {
      console.error("Error submitting course details:", error);
      // Error is already handled by the submitCurriculumCourseDetailsHandler
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      // Validate course outcomes
      return (
        courseOutcomes.length > 0 &&
        courseOutcomes.every(
          (outcome) =>
            outcome.name.trim() !== "" && outcome.statement.trim() !== ""
        )
      );
    } else if (currentStep === 2) {
      // Validate ABCD mapping
      return courseOutcomes.every((outcome) => {
        // Get the mapping for this outcome
        const mapping = getABCDMappingForCO(outcome.id);

        // If the outcome has no ABCD mapping, it's not valid
        if (!mapping) return false;

        const { behavior, condition, degree } = mapping;

        // Use the validation function
        return validateABCD(outcome, behavior, condition, degree);
      });
    } else if (currentStep === 3) {
      // Validate CPA classification
      return courseOutcomes.every((outcome) => {
        // Get the mapping for this outcome
        const mapping = getCPAMappingForCO(outcome.id);

        // If the outcome has no CPA mapping, it's not valid
        if (!mapping) return false;

        // A domain must be selected
        return mapping.domain !== null;
      });
    } else if (currentStep === 4) {
      // Validate PO mapping - each CO must be mapped to at least one PO
      return courseOutcomes.every((outcome) => {
        // Get the mappings for this outcome
        const mappings = getPOMappingsForCO(outcome.id);

        // The outcome must have at least one PO mapping
        return mappings.length > 0;
      });
    } else if (currentStep === 5) {
      // Validate TLA plan - each CO must have at least one assessment task and total weight must be 100%
      const allCOsHaveAssessmentTasks = courseOutcomes.every((outcome) => {
        const tasks = getAssessmentTasksForCO(outcome.id);
        return tasks.length > 0;
      });

      const totalWeight = getTotalAssessmentWeight();
      const isTotalWeightValid = Math.abs(totalWeight - 100) < 0.01; // Allow for small floating point errors

      return allCOsHaveAssessmentTasks && isTotalWeightValid;
    } else if (currentStep === 6) {
      // Validate TL plan - each CO must have at least one teaching method and one learning resource
      return courseOutcomes.every((outcome) => {
        const teachingMethods = getCOTeachingMethods(outcome.id);
        const learningResources = getCOLearningResources(outcome.id);
        return teachingMethods.length > 0 && learningResources.length > 0;
      });
    } else if (currentStep === 7) {
      // Review step is always valid
      return isConfirmed;
    }

    return false;
  };

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-2 border-green-500 rounded-full border-t-transparent"></div>
        <span className="ml-2">Loading course details...</span>
      </div>
    );
  }

  // If course not found, show error message
  if (!courseCode && !isLoading) {
    return (
      <div className="">
        <h1 className="text-2xl font-bold text-red-500">Course Not Found</h1>
        <p className="mt-2">
          The course you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/faculty/courses")}
        >
          Return to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      {formError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {typeof formError === "string"
              ? formError
              : Object.entries(formError).map(([key, errors]) => (
                  <div key={key} className="mt-1">
                    <strong>{key}:</strong> {errors.join(", ")}
                  </div>
                ))}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Course Details: {courseCode}</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{courseTitle}</h2>
        <p className="text-muted-foreground">
          Complete the following steps to add details to this course.
        </p>
      </div>

      {/* Step 1: Course Outcomes */}
      {currentStep === 1 && (
        <CourseOutcomesStep
          courseOutcomes={courseOutcomes}
          addCourseOutcome={addCourseOutcome}
          updateCourseOutcome={updateCourseOutcome}
          removeCourseOutcome={removeCourseOutcome}
        />
      )}
      {/* Step 2: ABCD Mapping */}
      {currentStep === 2 && (
        <CourseOutcomesABCDStep
          courseOutcomes={courseOutcomes}
          coAbcdMappings={coAbcdMappings}
          updateCourseOutcomeABCD={updateCourseOutcomeABCD}
          getABCDMappingForCO={getABCDMappingForCO}
          validateABCD={validateABCD}
        />
      )}

      {/* Step 3: CPA Classification */}
      {currentStep === 3 && (
        <CourseOutcomesCPAStep
          courseOutcomes={courseOutcomes}
          coCpaMappings={coCpaMappings}
          updateCourseOutcomeCPA={updateCourseOutcomeCPA}
          getCPAMappingForCO={getCPAMappingForCO}
        />
      )}

      {/* Step 4: PO Mapping */}
      {currentStep === 4 && (
        <CourseOutcomesPOStep
          courseOutcomes={courseOutcomes}
          programOutcomes={programOutcomes}
          poMappings={coPoMappings}
          onUpdatePO={updateCourseOutcomePO}
        />
      )}
      {/* Step 5: TLA Plan */}
      {currentStep === 5 && (
        <CourseOutcomesTLAStep
          courseOutcomes={courseOutcomes}
          assessmentTasks={assessmentTasks}
          onAddAssessmentTask={addAssessmentTask}
          onUpdateAssessmentTask={updateAssessmentTask}
          onRemoveAssessmentTask={removeAssessmentTask}
          getTotalAssessmentWeight={getTotalAssessmentWeight}
        />
      )}
      {/* Step 6: Teaching Methods and Learning Resources */}
      {currentStep === 6 && (
        <CourseOutcomesTLStep
          courseOutcomes={courseOutcomes}
          teachingMethods={teachingMethods}
          learningResources={learningResources}
          addTeachingMethod={addTeachingMethod}
          removeTeachingMethod={removeTeachingMethod}
          addLearningResource={addLearningResource}
          removeLearningResource={removeLearningResource}
          getCOTeachingMethods={getCOTeachingMethods}
          getCOLearningResources={getCOLearningResources}
          updateCOTeachingMethods={updateCOTeachingMethods}
          updateCOLearningResources={updateCOLearningResources}
        />
      )}

      {/* Step 7: Review */}
      {currentStep === 7 && (
        <CourseOutcomesReviewStep
          courseOutcomes={courseOutcomes}
          programOutcomes={programOutcomes}
          abcdMappings={coAbcdMappings}
          cpaMappings={coCpaMappings}
          poMappings={coPoMappings}
          assessmentTasks={assessmentTasks}
          teachingMethods={teachingMethods}
          learningResources={learningResources}
          getCOTeachingMethods={getCOTeachingMethods}
          getCOLearningResources={getCOLearningResources}
          isConfirmed={isConfirmed}
          setIsConfirmed={setIsConfirmed}
          onEditStep={setCurrentStep}
        />
      )}

      {/* Progress bar */}
      <div className="mt-12 mb-8">
        <Progress value={progressValue} className="h-2 bg-gray-200" />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isStepValid() || isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {currentStep === totalSteps
            ? isSubmitting
              ? "Submitting..."
              : "Submit"
            : "Next"}
        </Button>
      </div>
    </div>
  );
}
