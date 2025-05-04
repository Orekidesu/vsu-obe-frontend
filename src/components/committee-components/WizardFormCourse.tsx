"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CourseOutcome,
  useCourseDetailsStore,
} from "@/store/course/course-store";
import { CourseOutcomesStep } from "@/components/committee-components/form-steps/CourseOutcome";
import useCurriculumCourses from "@/hooks/faculty-member/useCourseCurriculum";
import { CourseOutcomesABCDStep } from "./form-steps/CourseOutcomeABCD";
import { CourseOutcomesCPAStep } from "./form-steps/CourseOutcomeCPA";
import { CourseOutcomesPOStep } from "./form-steps/CourseOutcomeToPO";

interface WizardFormCourseProps {
  courseId: string;
}

export function WizardFormCourse({ courseId }: WizardFormCourseProps) {
  const router = useRouter();
  const { curriculumCourses, isLoading } = useCurriculumCourses();

  const {
    courseCode,
    courseTitle,
    courseOutcomes,
    programOutcomes,
    coAbcdMappings,
    coCpaMappings,
    coPoMappings,
    currentStep,
    setCourseInfo,
    setCurrentStep,
    addCourseOutcome,
    updateCourseOutcome,
    removeCourseOutcome,
    updateCourseOutcomeABCD,
    updateCourseOutcomeCPA,
    updateCourseOutcomePO,
    getABCDMappingForCO,
    getCPAMappingForCO,
    getPOMappingsForCO,
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

  // Calculate progress percentage based on total steps
  const totalSteps = 4; // Currently only one step, will expand later
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

  const handleSubmit = () => {
    // In a real app, you would save the data to your backend
    console.log("Submitting course details:", {
      courseId,
      courseCode,
      courseTitle,
      courseOutcomes,
      coAbcdMappings,
      coCpaMappings,
      coPoMappings,
    });

    // Show success message
    alert("Course details saved successfully!");

    resetStore();
    // Navigate back to the courses page
    router.push("/faculty/courses");
  };

  // Check if current step is valid to proceed
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
    }
    return false;
  };

  if (programOutcomes.length === 0) {
    // This would normally be loaded from an API
    const samplePOs = [
      {
        id: 1,
        name: "Engineering Knowledge",
        statement:
          "Apply knowledge of mathematics, science, engineering fundamentals, and specialization to solve complex engineering problems.",
      },
      {
        id: 2,
        name: "Problem Analysis",
        statement:
          "Identify, formulate, research literature, and analyze complex engineering problems reaching substantiated conclusions.",
      },
      {
        id: 3,
        name: "Design/Development of Solutions",
        statement:
          "Design solutions for complex engineering problems and design system components or processes that meet specified needs.",
      },
      {
        id: 4,
        name: "Investigation",
        statement:
          "Conduct investigations of complex problems using research-based knowledge and methods including design of experiments, analysis and interpretation of data.",
      },
    ];
    useCourseDetailsStore.getState().setProgramOutcomes(samplePOs);
  }
  // Show loading state while course data is being fetched
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
          disabled={!isStepValid()}
          className="bg-green-600 hover:bg-green-700"
        >
          {currentStep === totalSteps ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}
