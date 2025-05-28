import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
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
import { ArrowLeft, ClipboardList, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import data and store
import { getSectionDisplayName } from "@/store/revision/sample-data/data";
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
import { ProgramRevisionReview } from "./ReviewRevision";

import useDepartmentRevision from "@/hooks/shared/useDepartmentRevision";

interface ProgramRevisionWizardProps {
  proposalId: string;
}

export function ProgramRevisionWizard({
  proposalId,
}: ProgramRevisionWizardProps) {
  const router = useRouter();
  // Initialize the store with sample data
  const {
    currentStep,
    isRevising,
    isReviewing,
    setCurrentStep,
    setIsRevising,
    setIsReviewing,
    initializeData,
    modifiedSections,
  } = useRevisionStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the proposal from API using cache
  const { getProgramProposalFromCache, submitDepartmentRevisions } =
    useProgramProposals();
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
  // const handleSubmitRevisions = async () => {
  //   setIsSubmitting(true);

  //   try {
  //     // Get only the modified sections data from the store
  //     const state = useRevisionStore.getState();
  //     // const dataToSubmit: Record<RevisionSection, unknown> = {};

  //     // modifiedSections.forEach((section) => {
  //     //   dataToSubmit[section] = state[section];
  //     // });
  //     const dataToSubmit: Record<string, unknown> = {};
  //     modifiedSections.forEach((section) => {
  //       dataToSubmit[section] = state[section];
  //     });

  //     // Only proceed if there are modifications
  //     if (Object.keys(dataToSubmit).length === 0) {
  //       toast({
  //         title: "No Changes",
  //         description: "No modifications were made to submit.",
  //         variant: "default",
  //       });
  //       setIsSubmitting(false);
  //       return;
  //     }

  //     // Submit the revisions to the API
  //     await submitDepartmentRevisions.mutateAsync({
  //       proposalId: proposalIdNumber,
  //       revisionData: dataToSubmit,
  //     });

  //     // Show success toast instead of setting state
  //     toast({
  //       title: "Success!",
  //       description: "Your revisions have been submitted successfully.",
  //       variant: "success",
  //     });

  //     // Log submission details for debugging
  //     console.group("Revision Submission Details");
  //     console.log(
  //       "Requested Revision Sections:",
  //       revisions.map((r) => r.section)
  //     );
  //     console.log("Modified Sections:", Array.from(modifiedSections));
  //     console.log("Submission Payload:", dataToSubmit);
  //     console.groupEnd();

  //     // Redirect after a delay
  //     setTimeout(() => {
  //       // router.push("/department/programs/all-programs");
  //       router.back();
  //     }, 3000);
  //   } catch (error: unknown) {
  //     console.error("Error submitting revisions:", error);
  //     toast({
  //       title: "Error",
  //       description:
  //         error instanceof Error
  //           ? error.message
  //           : "Failed to submit revisions. Please try again later.",
  //       variant: "destructive",
  //     });
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmitRevisions = async () => {
    setIsSubmitting(true);

    try {
      // Get only the modified sections data from the store
      const state = useRevisionStore.getState();
      const dataToSubmit: Record<string, unknown> = {};

      modifiedSections.forEach((section) => {
        // Copy the section data first
        let sectionData = JSON.parse(JSON.stringify(state[section]));

        // Process arrays of items with IDs
        if (Array.isArray(sectionData)) {
          // Handle sections with arrays of items
          switch (section) {
            case "peos":
            case "pos":
            case "course_categories":
            case "curriculum_courses":
              // First, identify which category IDs are actually new (have string IDs)
              const newCategoryIds = new Set();
              const existingCategoryIds = new Set();

              // Collect all existing category IDs
              state.course_categories.forEach((category) => {
                if (typeof category.id === "number") {
                  existingCategoryIds.add(category.id);
                } else if (
                  typeof category.id === "string" &&
                  /^\d+$/.test(category.id)
                ) {
                  newCategoryIds.add(category.id);
                }
              });

              sectionData = sectionData.map((item) => {
                const updatedItem = { ...item };

                // Check if the main ID is a newly generated numeric string
                if (
                  item.id &&
                  typeof item.id === "string" &&
                  /^\d+$/.test(item.id)
                ) {
                  updatedItem.id = `new_${item.id}`;
                }

                // Only add "new_" prefix to course_category_id if it's actually a reference
                // to a newly created category (in the newCategoryIds set)
                if (item.course_category_id) {
                  if (
                    typeof item.course_category_id === "string" &&
                    /^\d+$/.test(item.course_category_id)
                  ) {
                    // Check if this string matches an existing numeric category ID
                    const numericId = parseInt(item.course_category_id, 10);
                    if (existingCategoryIds.has(numericId)) {
                      // Convert back to number if it matches an existing category
                      updatedItem.course_category_id = numericId;
                    } else if (newCategoryIds.has(item.course_category_id)) {
                      // It's a reference to a newly created category
                      updatedItem.course_category_id = `new_${item.course_category_id}`;
                    }
                  }
                }

                return updatedItem;
              });
              break;
            // Handle mappings that reference items with potentially new IDs
            case "peo_mission_mappings":
            case "ga_peo_mappings":
            case "po_peo_mappings":
            case "po_ga_mappings":
              sectionData = sectionData.map((mapping) => {
                const updatedMapping = { ...mapping };

                // Check if peo_id is a numeric string
                if (
                  mapping.peo_id &&
                  typeof mapping.peo_id === "string" &&
                  /^\d+$/.test(mapping.peo_id)
                ) {
                  updatedMapping.peo_id = `new_${mapping.peo_id}`;
                }

                // Check if po_id is a numeric string
                if (
                  mapping.po_id &&
                  typeof mapping.po_id === "string" &&
                  /^\d+$/.test(mapping.po_id)
                ) {
                  updatedMapping.po_id = `new_${mapping.po_id}`;
                }

                return updatedMapping;
              });
              break;

            case "course_po_mappings":
              sectionData = sectionData.map((mapping) => {
                const updatedMapping = { ...mapping };

                // Check curriculum_course_id
                if (
                  mapping.curriculum_course_id &&
                  typeof mapping.curriculum_course_id === "string" &&
                  /^\d+$/.test(mapping.curriculum_course_id)
                ) {
                  updatedMapping.curriculum_course_id = `new_${mapping.curriculum_course_id}`;
                }

                // Check po_id
                if (
                  mapping.po_id &&
                  typeof mapping.po_id === "string" &&
                  /^\d+$/.test(mapping.po_id)
                ) {
                  updatedMapping.po_id = `new_${mapping.po_id}`;
                }

                return updatedMapping;
              });
              break;
          }
        }

        dataToSubmit[section] = sectionData;
      });

      // Only proceed if there are modifications
      if (Object.keys(dataToSubmit).length === 0) {
        toast({
          title: "No Changes",
          description: "No modifications were made to submit.",
          variant: "default",
        });
        setIsSubmitting(false);
        return;
      }

      // Submit the revisions to the API
      await submitDepartmentRevisions.mutateAsync({
        proposalId: proposalIdNumber,
        revisionData: dataToSubmit,
      });

      // Show success toast instead of setting state
      toast({
        title: "Success!",
        description: "Your revisions have been submitted successfully.",
        variant: "success",
      });

      localStorage.removeItem("program-revision-storage");

      // Log submission details for debugging
      console.group("Revision Submission Details");
      console.log(
        "Requested Revision Sections:",
        revisions.map((r) => r.section)
      );
      console.log("Modified Sections:", Array.from(modifiedSections));
      console.log("Submission Payload:", dataToSubmit);
      console.groupEnd();

      // Redirect after a delay
      setTimeout(() => {
        router.back();
      }, 3000);
    } catch (error: unknown) {
      console.error("Error submitting revisions:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit revisions. Please try again later.",
        variant: "destructive",
      });
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
    if (revisions.length === 0) return false;

    const currentRevision = revisions[currentStep];
    return modifiedSections.has(currentRevision.section as RevisionSection);
  };

  if (isLoadingProposal || isLoadingRevisions) {
    return (
      <div className="container mx-auto h-[500px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
          <h2 className="text-xl font-medium">Loading proposal data...</h2>
        </div>
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

  if (revisions.length === 0) {
    return (
      <div className="container mx-auto text-center">
        <AlertCircle className="h-10 w-10 mx-auto text-amber-500 mb-4" />
        <h2 className="text-xl font-medium">
          No Revisions Required in the Program Level
        </h2>
        <p className="text-gray-600 mt-2">
          This proposal does not have any revision requests at the program
          level. This proposal might be in revision due to courses that need
          some revisions. Check the details of this proposal and see if there
          are courses that need revisions.
        </p>
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
        {isRevising ? (
          <div className=" mx-auto">
            {isReviewing ? (
              <ProgramRevisionReview
                onGoBack={handleGoBackFromReview}
                onSubmit={handleSubmitRevisions}
                isSubmitting={isSubmitting}
                revisions={revisions}
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
            {/* <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Program Revision Requests</h1>
              <Button variant="outline" onClick={handleBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
              </Button>
            </div> */}

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
