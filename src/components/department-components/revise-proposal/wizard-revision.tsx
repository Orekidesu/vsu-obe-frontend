"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { format } from "date-fns";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import data and store
import {
  sampleProposalData,
  sampleRevisionData,
  getSectionDisplayName,
} from "@/store/revision/sample-data/data";
import {
  useRevisionStore,
  type RevisionSection,
} from "@/store/revision/revision-store";

// Import revision components
import { ProgramRevision } from "./program-revision";

interface RevisionWizardProps {
  proposalId: string;
}

export function RevisionWizard({ proposalId }: RevisionWizardProps) {
  const router = useRouter();
  const [isRevising, setIsRevising] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize the store with sample data
  const { initializeData, submitRevisions, modifiedSections } =
    useRevisionStore();

  useEffect(() => {
    // In a real app, this would fetch data from an API based on proposalId
    initializeData(sampleProposalData);
  }, [initializeData, proposalId]);

  const { revisions } = sampleRevisionData;

  // Start the revision process
  const handleStartRevision = () => {
    setIsRevising(true);
  };

  // Go back to the dashboard
  const handleBackToDashboard = () => {
    router.push("/");
  };

  // Go to the next step in the revision process
  const handleNextStep = () => {
    if (currentStep < revisions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the revisions
      handleSubmitRevisions();
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

  // Submit the revisions
  const handleSubmitRevisions = async () => {
    setIsSubmitting(true);

    try {
      const success = await submitRevisions();

      if (success) {
        setSubmitSuccess(true);

        // Redirect after a delay
        setTimeout(() => {
          router.push("/");
        }, 3000);
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

      default:
        return (
          <div className="p-8 text-center">
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

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 px-4">
        {submitSuccess ? (
          <Card className="max-w-3xl mx-auto">
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
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
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
          <div className="max-w-3xl mx-auto">
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
                    <CardTitle>{sampleProposalData.program.name}</CardTitle>
                    <CardDescription>
                      {sampleProposalData.program.abbreviation} -{" "}
                      {sampleProposalData.program.department_name}
                    </CardDescription>
                  </div>
                  <Badge className="bg-amber-500">
                    {sampleProposalData.program.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Proposed by</p>
                    <p className="font-medium">
                      {sampleProposalData.proposed_by.first_name}{" "}
                      {sampleProposalData.proposed_by.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Submitted</p>
                    <p className="font-medium">
                      {format(
                        new Date(sampleProposalData.created_at),
                        "MMMM d, yyyy"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Version</p>
                    <p className="font-medium">{sampleProposalData.version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {format(
                        new Date(sampleProposalData.updated_at),
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
                  {revisions.map((revision, index) => (
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
