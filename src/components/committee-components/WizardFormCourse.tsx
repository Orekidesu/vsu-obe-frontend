"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCourseDetailsStore } from "@/store/course/course-store";
import { CourseOutcomesStep } from "@/components/committee-components/form-steps/CourseOutcomeStep";
import useCurriculumCourses from "@/hooks/faculty-member/useCourseCurriculum";

interface WizardFormCourseProps {
  courseId: string;
}

export function WizardFormCourse({ courseId }: WizardFormCourseProps) {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { curriculumCourses, isLoading } = useCurriculumCourses();

  const { courseCode, courseTitle, courseOutcomes, setCourseInfo } =
    useCourseDetailsStore();

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
  const totalSteps = 1; // Currently only one step, will expand later
  const progressValue = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit the form
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
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
    });

    // Show success message
    alert("Course details saved successfully!");

    // Navigate back to the courses page
    router.push("/faculty/courses");
  };

  // Check if current step is valid to proceed
  const isStepValid = () => {
    if (step === 1) {
      // Validate course outcomes
      return (
        courseOutcomes.length > 0 &&
        courseOutcomes.every(
          (outcome) =>
            outcome.name.trim() !== "" && outcome.statement.trim() !== ""
        )
      );
    }
    return false;
  };

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
      {step === 1 && <CourseOutcomesStep />}

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
          {step === totalSteps ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}
