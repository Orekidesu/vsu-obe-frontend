import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle, RotateCcw, Info, Brain, Hand, Heart } from "lucide-react";
import { useCourseRevisionStore } from "./store-provider/CourseRevisionStoreProvider";

import { type CourseOutcome } from "@/store/revision/course-revision-store";
interface CPAClassificationRevisionProps {
  onValidityChange?: (isValid: boolean) => void;
}

export function CPAClassificationRevision({
  onValidityChange,
}: CPAClassificationRevisionProps) {
  const store = useCourseRevisionStore();
  const {
    courseOutcomes,
    modifiedSections,
    updateCourseOutcome,
    resetCPAClassifications,
    markSectionAsModified,
  } = store();
  const [activeTab, setActiveTab] = useState(0);

  const isModified = modifiedSections.has("cpa");

  const handleCPAChange = (value: string) => {
    const outcome = courseOutcomes[activeTab];
    updateCourseOutcome(outcome.id, { cpa: value });
    markSectionAsModified("cpa");
  };

  const handleReset = () => {
    resetCPAClassifications();
  };

  const getCompletedCount = useCallback(() => {
    return courseOutcomes.filter(
      (outcome) => outcome.cpa && outcome.cpa.trim() !== ""
    ).length;
  }, [courseOutcomes]);

  const isOutcomeComplete = (outcome: CourseOutcome) => {
    return outcome.cpa && outcome.cpa.trim() !== "";
  };

  useEffect(() => {
    const completedCount = getCompletedCount();
    const isValid =
      courseOutcomes.length > 0 && completedCount === courseOutcomes.length;

    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [courseOutcomes, onValidityChange, getCompletedCount]);

  if (courseOutcomes.length === 0) {
    return (
      <div className="text-center py-8">
        <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Course Outcomes
        </h3>
        <p className="text-gray-600">
          Please add course outcomes first before setting CPA classifications.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert className="bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="space-y-2">
            <p className="font-medium">Instructions:</p>
            <p>
              Classify each Course Outcome (CO) into one of the following
              learning domains:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>Cognitive (C):</strong> Knowledge, comprehension,
                application, analysis, synthesis, evaluation
              </li>
              <li>
                <strong>Psychomotor (P):</strong> Physical skills, coordination,
                technical abilities
              </li>
              <li>
                <strong>Affective (A):</strong> Attitudes, feelings, values,
                beliefs, interests
              </li>
            </ul>
            <p className="mt-2">
              Each CO must be classified under exactly one domain.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Header with Progress and Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            CPA Classification
            {isModified && (
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Modified
              </Badge>
            )}
          </h3>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={!isModified}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset CPA Classifications</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset all changes to the CPA
                classifications? This will restore the original classifications
                and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700"
              >
                Reset Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Progress: {getCompletedCount()} of {courseOutcomes.length} completed
        </div>
        <div className="flex items-center gap-2 text-sm text-amber-600">
          <Info className="h-4 w-4" />
          Complete all classifications to proceed
        </div>
      </div>

      {/* Course Outcome Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1">
          {courseOutcomes.map((outcome, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeTab === index
                  ? "bg-white border-blue-500 text-blue-600 shadow-sm"
                  : "bg-gray-50 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                CO {index + 1}
                {isOutcomeComplete(outcome) && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Course Outcome */}
      {courseOutcomes[activeTab] && (
        <div className="space-y-6">
          {/* Course Outcome Header */}
          <div>
            <h3 className="text-lg font-semibold">
              CO {activeTab + 1}: {courseOutcomes[activeTab].name}
            </h3>
          </div>

          {/* Statement */}
          <div>
            <p className="font-medium mb-2">Statement:</p>
            <p className="text-gray-700">
              {courseOutcomes[activeTab].statement}
            </p>
          </div>

          {/* CPA Selection */}
          <div>
            <p className="font-medium mb-4">Select one learning domain:</p>

            <RadioGroup
              value={courseOutcomes[activeTab].cpa || ""}
              onValueChange={handleCPAChange}
              className="grid grid-cols-3 gap-4"
            >
              {/* Cognitive */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="C" id="cognitive" />
                  <Brain className="h-4 w-4 text-blue-500" />
                  <Label
                    htmlFor="cognitive"
                    className="font-medium cursor-pointer"
                  >
                    Cognitive (C)
                  </Label>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  Knowledge, comprehension, application, analysis, synthesis,
                  evaluation
                </p>
              </div>

              {/* Psychomotor */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="P" id="psychomotor" />
                  <Hand className="h-4 w-4 text-green-500" />
                  <Label
                    htmlFor="psychomotor"
                    className="font-medium cursor-pointer"
                  >
                    Psychomotor (P)
                  </Label>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  Physical skills, coordination, technical abilities
                </p>
              </div>

              {/* Affective */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="A" id="affective" />
                  <Heart className="h-4 w-4 text-red-500" />
                  <Label
                    htmlFor="affective"
                    className="font-medium cursor-pointer"
                  >
                    Affective (A)
                  </Label>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  Attitudes, feelings, values, beliefs, interests
                </p>
              </div>
            </RadioGroup>

            {/* Validation Message */}
            {!courseOutcomes[activeTab].cpa && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  Please select exactly one learning domain for this Course
                  Outcome.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
