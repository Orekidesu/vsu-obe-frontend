import { useState } from "react";
import { useRevisionStore } from "@/store/revision/revision-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getSectionDisplayName } from "@/store/revision/sample-data/data";
import {
  ArrowLeft,
  CheckCircle,
  ClipboardList,
  AlertTriangle,
  Info,
} from "lucide-react";
import { sampleRevisionData } from "@/store/revision/sample-data/data";

interface RevisionReviewProps {
  onGoBack: (section?: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function RevisionReview({
  onGoBack,
  onSubmit,
  isSubmitting,
}: RevisionReviewProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { modifiedSections, program } = useRevisionStore();
  const modifiedSectionsList = Array.from(modifiedSections);

  // Get revision requests for modified sections
  const getRevisionRequest = (section: string) => {
    const revision = sampleRevisionData.revisions.find(
      (rev) => rev.section === section
    );
    return revision?.details || "No specific revision request found.";
  };

  // Get summary of changes for each section
  const getChangeSummary = (section: string) => {
    // In a real app, this would analyze the actual changes made
    // For now, we'll return placeholder text based on the section
    switch (section) {
      case "program":
        return "Program details were updated.";
      case "peos":
        return "Program Educational Objectives were modified.";
      case "peo_mission_mappings":
        return "PEO to Mission mappings were updated.";
      case "ga_peo_mappings":
        return "Graduate Attribute to PEO mappings were modified.";
      case "pos":
        return "Program Outcomes were updated.";
      case "po_peo_mappings":
        return "Program Outcome to PEO mappings were modified.";
      case "po_ga_mappings":
        return "Program Outcome to Graduate Attribute mappings were updated.";
      case "curriculum":
        return "Curriculum details were modified.";
      case "course_categories":
        return "Course categories were updated.";
      case "curriculum_courses":
        return "Curriculum courses were modified.";
      case "course_po_mappings":
        return "Course to Program Outcome mappings were updated.";
      default:
        return "Changes were made to this section.";
    }
  };

  // Handle submission
  const handleSubmit = () => {
    if (!isConfirmed) return;
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Review Your Revisions</h1>
        <Badge className="bg-amber-500 text-white">Review</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="h-5 w-5 mr-2" /> Program Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Program Name</p>
              <p className="font-medium">{program.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Program Abbreviation</p>
              <p className="font-medium">{program.abbreviation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sections Modified</p>
              <p className="font-medium">{modifiedSections.size} of 11</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge className="bg-green-500">Ready for Submission</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Modified Sections</h2>
        <p className="text-gray-600">
          The following sections have been modified. Review your changes before
          submitting.
        </p>
      </div>

      <Accordion type="multiple" className="w-full">
        {modifiedSectionsList.map((section) => (
          <AccordionItem key={section} value={section}>
            <AccordionTrigger className="hover:bg-gray-50 px-4 py-2 rounded-md">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center">
                  <Badge className="mr-3 bg-green-500">Modified</Badge>
                  <span className="font-medium">
                    {getSectionDisplayName(section)}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 pb-4">
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <p className="text-sm font-medium text-amber-800 mb-1">
                    Original Revision Request:
                  </p>
                  <p className="text-sm text-amber-700">
                    {getRevisionRequest(section)}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Changes Made:
                  </p>
                  <p className="text-sm text-green-700">
                    {getChangeSummary(section)}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGoBack(section)}
                  className="mt-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Review or Edit this
                  Section
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {modifiedSections.size === 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-800" />
          <AlertDescription className="text-amber-800">
            No sections have been modified yet. Please make changes to at least
            one section before submitting.
          </AlertDescription>
        </Alert>
      )}

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          After submission, your revisions will be reviewed by the appropriate
          personnel. You will be notified once the review is complete.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="confirm"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="confirm" className="text-sm">
              I confirm that I have reviewed all the changes made to the program
              proposal and am ready to submit these revisions for review. I
              understand that once submitted, these changes will be reviewed by
              the appropriate personnel.
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => onGoBack()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Revisions
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !isConfirmed || modifiedSections.size === 0 || isSubmitting
            }
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
                Submitting...
              </span>
            ) : (
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" /> Submit All Revisions
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
