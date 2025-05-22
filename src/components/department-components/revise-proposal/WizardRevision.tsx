import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

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
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import data and store
import {
  // sampleRevisionData,
  getSectionDisplayName,
} from "@/store/revision/sample-data/data";
import {
  useRevisionStore,
  type RevisionSection,
} from "@/store/revision/revision-store";

// Import revision components
import { ProgramRevision } from "./ProgramRevision";
import { PEOsRevision } from "./PEOSRevision";
import { PEOMissionMappingRevision } from "./PEOMissionMappingRevision";
import { GAPEOMappingRevision } from "./GAPEOMappingRevision";
import { POsRevision } from "./POSRevision";
import { POGAMappingRevision } from "./POGAMappingRevision";

import useProgramProposals from "@/hooks/department/useProgramProposal";
import { POPEOMappingRevision } from "./POPEOMappingRevision";
import { CurriculumRevision } from "./CurriculumRevision";
import { CourseCategoriesRevision } from "./CourseCategoryRevision";
import { CurriculumCoursesRevision } from "./CurriculumCourseRevision";
import { CoursePOMappingRevision } from "./CoursePOMappingRevision";
import { RevisionReview } from "./ReviewRevision";

import useDepartmentRevision from "@/hooks/shared/useDepartmentRevision";

interface RevisionWizardProps {
  proposalId: string;
}

export function RevisionWizard({ proposalId }: RevisionWizardProps) {
  const router = useRouter();
  const [isRevising, setIsRevising] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // Get the proposal from API using cache
  const { getProgramProposalFromCache } = useProgramProposals();
  const proposalIdNumber = parseInt(proposalId, 10);

  // Fetch the revision data from API
  const {
    revisionData,
    isLoading: isLoadingRevisions,
    error: revisionError,
  } = useDepartmentRevision(proposalIdNumber);

  const { data: proposalData, isLoading: isLoadingProposal } = useQuery(
    getProgramProposalFromCache(proposalIdNumber)
  );

  // Initialize the store with sample data
  const { initializeData, submitRevisions, modifiedSections } =
    useRevisionStore();

  useEffect(() => {
    if (proposalData) {
      initializeData(proposalData);
    }
  }, [initializeData, proposalData]);

  // const { revisions } = sampleRevisionData;
  // Get revisions from API data or fallback to empty array if not available
  const revisions = revisionData?.revisions || [];

  // Start the revision process
  const handleStartRevision = () => {
    setIsRevising(true);
  };

  // Go back to the dashboard
  const handleBackToDashboard = () => {
    router.push("/department/programs/all-programs");
  };

  // Go to the next step in the revision process
  const handleNextStep = () => {
    if (currentStep < revisions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Go to review page
      setIsReviewing(true);
    }
  };

  // Go to the previous step in the revision process
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Go back to the revision details
      setIsRevising(false);
    }
  };

  // Go back from review to a specific section
  const handleGoBackFromReview = (section?: string) => {
    if (section) {
      // Find the index of the specified section
      const sectionIndex = revisions.findIndex(
        (rev) => rev.section === section
      );
      if (sectionIndex !== -1) {
        setCurrentStep(sectionIndex);
        setIsReviewing(false);
      }
    } else {
      // Go back to the last step
      setIsReviewing(false);
    }
  };

  // Submit the revisions
  const handleSubmitRevisions = async () => {
    setIsSubmitting(true);

    try {
      const success = await submitRevisions();

      if (success) {
        setSubmitSuccess(true);

        // Enhanced logging
        console.group("Revision Submission Details");
        console.log(
          "Requested Revision Sections:",
          revisions.map((r) => r.section)
        );
        console.log("Modified Sections:", Array.from(modifiedSections));

        // Get the actual payload data
        const state = useRevisionStore.getState();
        const dataToSubmit = {};
        modifiedSections.forEach((section) => {
          dataToSubmit[section] = state[section];
        });
        console.log("Submission Payload:", dataToSubmit);
        console.groupEnd();

        // Redirect after a delay
        setTimeout(() => {}, 3000);
      } else {
        // Handle submission error
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting revisions:", error);
      setIsSubmitting(false);
    }
  };

  // Get the component for the current revision step
  const getCurrentRevisionComponent = () => {
    const currentRevision = revisions[currentStep];
    const section = currentRevision.section as RevisionSection;

    switch (section) {
      case "program":
        return <ProgramRevision />;
      case "peos":
        return <PEOsRevision />;
      case "peo_mission_mappings":
        return <PEOMissionMappingRevision />;
      case "ga_peo_mappings":
        return <GAPEOMappingRevision />;
      case "pos":
        return <POsRevision />;
      case "po_peo_mappings":
        return <POPEOMappingRevision />;
      case "po_ga_mappings":
        return <POGAMappingRevision />;
      case "curriculum":
        return <CurriculumRevision />;
      case "course_categories":
        return <CourseCategoriesRevision />;
      case "curriculum_courses":
        return <CurriculumCoursesRevision />;
      case "course_po_mappings":
        return <CoursePOMappingRevision />;
      default:
        return (
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium">Unknown Revision Section</h3>
            <p className="text-gray-600 mt-2">
              The revision section &quot;{currentRevision.section}&quot; does
              not have a corresponding component.
            </p>
          </div>
        );
    }
  };

  // Check if the current section has been modified
  const isCurrentSectionModified = () => {
    const currentRevision = revisions[currentStep];
    return modifiedSections.has(currentRevision.section as RevisionSection);
  };

  if (isLoadingProposal || isLoadingRevisions) {
    return (
      <div className="container mx-auto  text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading proposal data...</h2>
      </div>
    );
  }
  // Error handling for revision data
  if (revisionError) {
    return (
      <div className="container mx-auto text-center">
        <AlertCircle className="h-10 w-10 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-medium">Failed to load revision data</h2>
        <p className="text-gray-600 mt-2">{revisionError.message}</p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={handleBackToDashboard}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container ">
        {submitSuccess ? (
          <Card className="">
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Revisions Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your revisions have been submitted and will be reviewed by the
                appropriate personnel.
              </p>
              <Button onClick={handleBackToDashboard}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : isRevising ? (
          <div className=" mx-auto">
            {isReviewing ? (
              <RevisionReview
                onGoBack={handleGoBackFromReview}
                onSubmit={handleSubmitRevisions}
                isSubmitting={isSubmitting}
              />
            ) : (
              <>
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
                    {getSectionDisplayName(revisions[currentStep].section)}
                  </h1>

                  {isCurrentSectionModified() && (
                    <Badge className="ml-2 bg-green-500">Modified</Badge>
                  )}
                </div>

                <Card className="mb-6">
                  <CardHeader className="bg-amber-50 border-b">
                    <CardTitle className="text-amber-800">
                      Revision Request
                    </CardTitle>
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

                    <Button
                      onClick={handleNextStep}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {currentStep < revisions.length - 1
                        ? "Next"
                        : "Review Changes"}
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
              </>
            )}
          </div>
        ) : (
          <div className="mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Program Revision Requests</h1>
              <Button variant="outline" onClick={handleBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
              </Button>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{proposalData?.program.name}</CardTitle>
                    <CardDescription>
                      {proposalData?.program.abbreviation} -{" "}
                      {proposalData?.program.department_name}
                    </CardDescription>
                  </div>
                  <Badge className="bg-amber-500">
                    {proposalData?.program.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Proposed by</p>
                    <p className="font-medium">
                      {proposalData?.proposed_by.first_name}{" "}
                      {proposalData?.proposed_by.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Submitted</p>
                    <p className="font-medium">
                      {format(
                        new Date(proposalData?.created_at || new Date()),
                        "MMMM d, yyyy"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Version</p>
                    <p className="font-medium">{proposalData?.version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {format(
                        new Date(proposalData?.updated_at || new Date()),
                        "MMMM d, yyyy"
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-800" />
              <AlertTitle className="text-amber-800">
                Revision Required
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                This program proposal requires revisions before it can be
                approved. Please review the revision requests below and make the
                necessary changes.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" /> Revision Requests
                </CardTitle>
                <CardDescription>
                  The following sections need to be revised based on feedback
                  from the reviewer.
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
                            {getSectionDisplayName(revision.section)}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {revision.details}
                          </p>
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
                  Start Revision Process
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
