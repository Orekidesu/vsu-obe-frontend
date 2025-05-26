import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Clock,
  Users,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

// Import data
import {
  sampleCourseRevisionData,
  getCourseRevisionSectionDisplayName,
  getSemesterDisplayName,
} from "@/store/revision/sample-data/courseData";

import useCurriculumCourses from "@/hooks/faculty-member/useCourseCurriculum";

import { CourseOutcomesRevision } from "./CourseOutcomeRevision";
import { useCourseRevisionStore } from "@/store/revision/course-revision-store";
import { ABCDModelRevision } from "./ABCDModelRevision";
import { CPAClassificationRevision } from "./CPAClassificationRevision";
import { COPOMappingRevision } from "./COPOMappingRevision";
import { TLATasksRevision } from "./TLATaskRevision";
import { TLAMethodsRevision } from "./TLAMethodRevision";

import { CourseRevisionReview } from "./CurriculumCourseRevisionReview";

interface CurriculumCourseRevisionWizardProps {
  curriculumCourseId: string;
}

export function CurriculumCourseRevisionWizard({
  curriculumCourseId,
}: CurriculumCourseRevisionWizardProps) {
  const router = useRouter();
  const [isRevising, setIsRevising] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [showReview, setShowReview] = useState(false);

  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);

  const { getCurriculumCourse, isLoading } = useCurriculumCourses({
    includeOutcomes: true,
  });

  const courseId = parseInt(curriculumCourseId, 10);
  const { data: courseData, error } = useQuery(
    getCurriculumCourse(courseId, true)
  );
  const { revisions } = sampleCourseRevisionData;

  useEffect(() => {
    if (courseData && !isRevising) {
      // Ensure course_outcomes is always an array by providing default if undefined
      const courseWithOutcomes = {
        ...courseData,
        course_outcomes: courseData.course_outcomes || [],
      };

      useCourseRevisionStore.getState().setCurrentCourse(courseWithOutcomes);
    }
  }, [courseData, isRevising]);

  // Start the revision process
  const handleStartRevision = () => {
    setIsRevising(true);
  };

  // Go back to the course list or dashboard
  const handleBackToCourses = () => {
    router.push("/faculty/all-courses");
  };

  // Go to the next step in the revision process
  const handleNextStep = () => {
    if (currentStep < revisions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show review page
      setShowReview(true);
    }
  };

  // Go to the previous step in the revision process
  const handlePreviousStep = () => {
    if (showReview) {
      setShowReview(false);
      return;
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Go back to the revision details
      setIsRevising(false);
    }
  };

  // Handle back from review
  const handleBackFromReview = () => {
    setShowReview(false);
  };

  // Add this function after the handleBackFromReview function
  const handleEditSection = (section: string) => {
    // Find the step index for the given section
    const stepIndex = revisions.findIndex(
      (revision) => revision.section === section
    );
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
      setShowReview(false);
    }
  };

  // Submit the revisions
  const handleSubmitRevisions = async () => {
    setIsSubmitting(true);

    try {
      // Generate the submission payload
      const payload = useCourseRevisionStore
        .getState()
        .generateSubmissionPayload();

      console.log(
        "Submitting course revisions payload:",
        JSON.stringify(payload, null, 2)
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitSuccess(true);

      // Redirect after a delay
      setTimeout(() => {
        router.push("/faculty/all-courses");
      }, 3000);
    } catch (error) {
      console.error("Error submitting revisions:", error);
      setIsSubmitting(false);
    }
  };

  // Get the component for the current revision step
  const getCurrentRevisionComponent = () => {
    const currentRevision = revisions[currentStep];

    switch (currentRevision.section) {
      case "course_outcomes":
        return (
          <CourseOutcomesRevision onValidityChange={setIsCurrentStepValid} />
        );
      case "abcd":
        return <ABCDModelRevision onValidityChange={setIsCurrentStepValid} />;
      case "cpa":
        return (
          <CPAClassificationRevision onValidityChange={setIsCurrentStepValid} />
        );
      case "po_mappings":
        return <COPOMappingRevision onValidityChange={setIsCurrentStepValid} />;
      case "tla_tasks":
        return <TLATasksRevision onValidityChange={setIsCurrentStepValid} />;
      case "tla_assessment_method":
        return <TLAMethodsRevision onValidityChange={setIsCurrentStepValid} />;
      default:
        // For other sections, return a placeholder component
        // Set the current step as valid immediately
        // We need to do this outside of the component rendering function
        setIsCurrentStepValid(true);

        return (
          <div className="p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium">Revision Component</h3>
            <p className="text-gray-600 mt-2">
              The revision component for &quot;
              {getCourseRevisionSectionDisplayName(currentRevision.section)}
              &quot; will be implemented here.
            </p>
          </div>
        );
    }
  };

  // Loading state
  if (isLoading || !courseData) {
    return (
      <div className="container mx-auto h-[500px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
          <h2 className="text-xl font-medium">Loading course data...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error
              ? `Error: ${error.message}`
              : "The requested course could not be found."}
          </p>
          <Button onClick={handleBackToCourses}>Return to Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {submitSuccess ? (
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Course Revisions Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your course revisions have been submitted and will be reviewed by
              the appropriate personnel.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Submission Summary:</strong>
              </p>
              <p className="text-sm text-gray-600">
                Course outcomes and all associated data (ABCD model, CPA
                classification, PO mappings, TLA tasks, and assessment methods)
                have been successfully updated.
              </p>
            </div>
            <Button onClick={handleBackToCourses}>Return to Courses</Button>
          </CardContent>
        </Card>
      ) : showReview ? (
        <CourseRevisionReview
          onBack={handleBackFromReview}
          onSubmit={handleSubmitRevisions}
          isSubmitting={isSubmitting}
          onEditSection={handleEditSection}
        />
      ) : isRevising ? (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold">
              Revising:{" "}
              {getCourseRevisionSectionDisplayName(
                revisions[currentStep].section
              )}
            </h1>
          </div>

          <Card className="mb-6">
            <CardHeader className="bg-amber-50 border-b">
              <CardTitle className="text-amber-800">Revision Request</CardTitle>
              <CardDescription className="text-amber-700">
                {revisions[currentStep].details}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {getCurrentRevisionComponent()}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handlePreviousStep}>
                Back
              </Button>
              {/* <Button
                onClick={handleNextStep}
                disabled={isSubmitting || !isCurrentStepValid}
                className={`${
                  isCurrentStepValid
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : currentStep < revisions.length - 1 ? (
                  "Next"
                ) : (
                  "Submit Revisions"
                )}
              </Button> */}

              <Button
                disabled={!isCurrentStepValid}
                onClick={handleNextStep}
                className="bg-green-600 hover:bg-green-700"
              >
                {currentStep < revisions.length - 1 ? "Next" : "Review Changes"}
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {revisions.length}
            </div>
            <div className="flex gap-2">
              {revisions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full ${
                    index === currentStep
                      ? "bg-green-600"
                      : index < currentStep
                        ? "bg-green-300"
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Course Revision Requests</h1>
            <Button variant="outline" onClick={handleBackToCourses}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {courseData.course.code} -{" "}
                    {courseData.course.descriptive_title}
                  </CardTitle>
                  <CardDescription>
                    {courseData.curriculum.name}
                  </CardDescription>
                </div>
                <Badge className="bg-amber-500">REVISION REQUIRED</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">
                      {courseData.course_category.name} (
                      {courseData.course_category.code})
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Semester</p>
                    <p className="font-medium">
                      {getSemesterDisplayName(courseData.semester)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Units</p>
                  <p className="font-medium">{courseData.units}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Course Outcomes</p>
                  <p className="font-medium">
                    {courseData?.course_outcomes?.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    className={
                      courseData.is_completed ? "bg-green-500" : "bg-yellow-500"
                    }
                  >
                    {courseData.is_completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revision Status</p>
                  <Badge
                    className={
                      courseData.is_in_revision ? "bg-red-500" : "bg-gray-500"
                    }
                  >
                    {courseData.is_in_revision ? "In Revision" : "No Revision"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-800" />
            <AlertTitle className="text-amber-800">
              Course Revision Required
            </AlertTitle>
            <AlertDescription className="text-amber-700">
              This course requires revisions to its outcomes, assessments, and
              mappings before it can be approved. Please review the revision
              requests below and make the necessary changes.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="h-5 w-5 mr-2" /> Revision Requests
              </CardTitle>
              <CardDescription>
                The following sections need to be revised based on feedback from
                the reviewer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revisions.map((revision) => (
                  <div
                    key={revision.id}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">
                          {getCourseRevisionSectionDisplayName(
                            revision.section
                          )}
                        </h3>
                        <p className="text-gray-600 mt-1">{revision.details}</p>
                      </div>
                      <Badge variant="outline" className="text-gray-600">
                        {format(new Date(revision.created_at), "MMM d, yyyy")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button
                onClick={handleStartRevision}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Start Course Revision Process
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
