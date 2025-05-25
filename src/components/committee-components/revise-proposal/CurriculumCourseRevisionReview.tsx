import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Info,
  CheckCircle2,
  BookOpen,
  Target,
  Users,
  ClipboardList,
  GraduationCap,
  Lightbulb,
} from "lucide-react";

import { useCourseRevisionStore } from "@/store/revision/course-revision-store";
import {
  sampleCourseRevisionData,
  getCourseRevisionSectionDisplayName,
} from "@/store/revision/sample-data/courseData";

interface CourseRevisionReviewProps {
  onBack: () => void;
  onSubmit: () => void;
  onEditSection: (section: string) => void;
  isSubmitting?: boolean;
}

export function CourseRevisionReview({
  onBack,
  onSubmit,
  onEditSection,
  isSubmitting = false,
}: CourseRevisionReviewProps) {
  const { currentCourse, modifiedSections, courseOutcomes } =
    useCourseRevisionStore();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const { revisions } = sampleCourseRevisionData;

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getModifiedSectionsList = () => {
    return Array.from(modifiedSections).map((section) => {
      const revision = revisions.find((r) => r.section === section);
      return {
        section,
        revision,
        displayName: getCourseRevisionSectionDisplayName(section),
      };
    });
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case "course_outcomes":
        return <Target className="h-4 w-4" />;
      case "abcd":
        return <BookOpen className="h-4 w-4" />;
      case "cpa":
        return <GraduationCap className="h-4 w-4" />;
      case "po_mappings":
        return <Users className="h-4 w-4" />;
      case "tla_tasks":
        return <ClipboardList className="h-4 w-4" />;
      case "tla_methods":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSectionChanges = (section: string) => {
    switch (section) {
      case "course_outcomes":
        return `Updated ${courseOutcomes.length} course outcomes with revised statements and descriptions.`;
      case "abcd":
        return "ABCD model components (Audience, Behavior, Condition, Degree) have been refined for better clarity.";
      case "cpa":
        return "CPA (Cognitive, Psychomotor, Affective) classifications have been updated to align with learning objectives.";
      case "po_mappings":
        return "Course Outcome to Program Outcome mappings have been revised with updated IED (Introduced, Emphasized, Demonstrated) levels.";
      case "tla_tasks":
        const totalTasks = courseOutcomes.reduce(
          (sum, co) => sum + co.tla_tasks.length,
          0
        );
        return `Assessment tasks have been updated with ${totalTasks} total tasks across all course outcomes.`;
      case "tla_methods":
        const totalMethods = courseOutcomes.reduce(
          (sum, co) => sum + co.tla_assessment_method.teaching_methods.length,
          0
        );
        const totalResources = courseOutcomes.reduce(
          (sum, co) => sum + co.tla_assessment_method.learning_resources.length,
          0
        );
        return `Teaching methods and learning resources updated with ${totalMethods} methods and ${totalResources} resources.`;
      default:
        return "Section has been updated with the requested changes.";
    }
  };

  const modifiedSectionsList = getModifiedSectionsList();
  const totalModifiedSections = modifiedSectionsList.length;
  const totalRevisionRequests = revisions.length;

  if (!currentCourse) {
    return (
      <div className="p-8 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Course Data</h3>
        <p className="text-gray-600 mt-2">
          Unable to load course information for review.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Review Your Revisions</h1>
        <Button variant="outline" size="sm">
          Preview
        </Button>
      </div>

      {/* Course Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Course Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Course Code & Title</p>
              <p className="font-medium">
                {currentCourse.course.code} -{" "}
                {currentCourse.course.descriptive_title}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Course Category</p>
              <p className="font-medium">
                {currentCourse.course_category.name} (
                {currentCourse.course_category.code})
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Sections Modified</p>
              <p className="font-medium">
                {totalModifiedSections} of {totalRevisionRequests}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <Badge className="bg-green-500">Ready for Submission</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revision Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Revision Requests</CardTitle>
          <CardDescription>
            Review all sections that were requested for revision and your
            changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Modified Sections</h4>
              <div className="space-y-3">
                {modifiedSectionsList.map(
                  ({ section, revision, displayName }) => (
                    <Collapsible
                      key={section}
                      open={expandedSections.has(section)}
                      onOpenChange={() => toggleSection(section)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center">
                            <Badge className="bg-green-500 mr-3">
                              Modified
                            </Badge>
                            <div className="flex items-center">
                              {getSectionIcon(section)}
                              <span className="ml-2 font-medium">
                                {displayName}
                              </span>
                            </div>
                          </div>
                          {expandedSections.has(section) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3">
                        <div className="space-y-3 pl-6">
                          {revision && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <p className="text-sm font-medium text-amber-800 mb-1">
                                Original Revision Request:
                              </p>
                              <p className="text-sm text-amber-700">
                                {revision.details}
                              </p>
                            </div>
                          )}
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium text-green-800 mb-1">
                              Changes Made:
                            </p>
                            <p className="text-sm text-green-700">
                              {getSectionChanges(section)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => onEditSection(section)}
                          >
                            <ArrowLeft className="h-3 w-3 mr-1" />
                            Edit This Section
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Information */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          After submission, your revisions will be reviewed by the appropriate
          personnel. You will be notified once the review is complete.
        </AlertDescription>
      </Alert>

      {/* Confirmation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="confirm-submission"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="confirm-submission"
              className="text-sm leading-relaxed cursor-pointer"
            >
              I confirm that I have reviewed all the changes made to the course
              proposal and am ready to submit these revisions for review. I
              understand that once submitted, these changes will be reviewed by
              the appropriate personnel.
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Revisions
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!isConfirmed || isSubmitting}
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
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Submit All Revisions
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
