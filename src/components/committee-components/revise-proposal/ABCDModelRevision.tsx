import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Edit,
  Target,
  BookOpen,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import {
  useCourseRevisionStore,
  type CourseOutcome,
} from "@/store/revision/course-revision-store";

export function ABCDModelRevision() {
  const {
    courseOutcomes,
    modifiedSections,
    updateCourseOutcome,
    resetCourseOutcomes,
  } = useCourseRevisionStore();

  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Check if this section has been modified
  const isModified = modifiedSections.has("course_outcomes");

  // Form state for editing ABCD model
  const [formData, setFormData] = useState({
    audience: "",
    behavior: "",
    condition: "",
    degree: "",
  });

  const resetForm = () => {
    setFormData({
      audience: "",
      behavior: "",
      condition: "",
      degree: "",
    });
  };

  const startEditing = (outcome: CourseOutcome) => {
    setIsEditing(true);
    setFormData({
      audience: outcome.abcd.audience,
      behavior: outcome.abcd.behavior,
      condition: outcome.abcd.condition,
      degree: outcome.abcd.degree,
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    resetForm();
  };

  const isFormDataValid = (outcome: CourseOutcome, data: typeof formData) => {
    const { audience, behavior, condition, degree } = data;

    // Check if all required fields are filled
    if (!audience || !behavior || !condition || !degree) {
      return false;
    }

    // Check if B, C, D components are actually in the statement
    const statementLower = outcome.statement.toLowerCase();
    const behaviorLower = behavior.toLowerCase();
    const conditionLower = condition.toLowerCase();
    const degreeLower = degree.toLowerCase();

    if (
      !statementLower.includes(behaviorLower) ||
      !statementLower.includes(conditionLower) ||
      !statementLower.includes(degreeLower)
    ) {
      return false;
    }

    // Check for overlaps between B, C, D components
    if (
      behaviorLower === conditionLower ||
      behaviorLower === degreeLower ||
      conditionLower === degreeLower ||
      behaviorLower.includes(conditionLower) ||
      behaviorLower.includes(degreeLower) ||
      conditionLower.includes(behaviorLower) ||
      conditionLower.includes(degreeLower) ||
      degreeLower.includes(behaviorLower) ||
      degreeLower.includes(conditionLower)
    ) {
      return false;
    }

    return true;
  };

  const saveChanges = () => {
    const currentOutcome = courseOutcomes[activeTab];
    if (currentOutcome && isFormDataValid(currentOutcome, formData)) {
      updateCourseOutcome(currentOutcome.id, {
        ...currentOutcome,
        abcd: {
          audience: formData.audience,
          behavior: formData.behavior,
          condition: formData.condition,
          degree: formData.degree,
        },
      });
      setIsEditing(false);
      resetForm();
    }
  };

  const handleReset = () => {
    resetCourseOutcomes();
    setIsEditing(false);
    resetForm();
  };

  const isABCDComplete = (outcome: CourseOutcome) => {
    const { audience, behavior, condition, degree } = outcome.abcd;

    // First check if all required fields are filled
    if (!audience || !behavior || !condition || !degree) {
      return false;
    }

    // Check if B, C, D components are actually in the statement
    const statementLower = outcome.statement.toLowerCase();
    const behaviorLower = behavior.toLowerCase();
    const conditionLower = condition.toLowerCase();
    const degreeLower = degree.toLowerCase();

    if (
      !statementLower.includes(behaviorLower) ||
      !statementLower.includes(conditionLower) ||
      !statementLower.includes(degreeLower)
    ) {
      return false;
    }

    // Check for overlaps between B, C, D components
    if (
      behaviorLower === conditionLower ||
      behaviorLower === degreeLower ||
      conditionLower === degreeLower ||
      behaviorLower.includes(conditionLower) ||
      behaviorLower.includes(degreeLower) ||
      conditionLower.includes(behaviorLower) ||
      conditionLower.includes(degreeLower) ||
      degreeLower.includes(behaviorLower) ||
      degreeLower.includes(conditionLower)
    ) {
      return false;
    }

    // If all checks pass
    return true;
  };

  const completedOutcomes = courseOutcomes.filter(isABCDComplete).length;

  const currentOutcome = courseOutcomes[activeTab];
  const currentData = isEditing ? formData : currentOutcome?.abcd;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Target className="h-6 w-6 mr-2 text-blue-600" />
            ABCD Model
            {isModified && (
              <Badge className="ml-3 bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Modified
              </Badge>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            Define the ABCD components (Audience, Behavior, Condition, Degree)
            for each course outcome to create well-structured learning
            objectives.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={!isModified}
              className="text-gray-600"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset ABCD Models</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset all changes to the ABCD models?
                This will restore the original ABCD components and cannot be
                undone.
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

      {/* Instructions */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-900 mb-2">Instructions:</h3>
              <p className="text-amber-800 mb-3">
                Identify and extract the phrase or word from each CO statement
                that best represents each of the ABCD components:
              </p>
              <ul className="space-y-1 text-amber-800">
                <li>
                  <strong>A (Audience):</strong> Can be anything, doesn&apos;t
                  need to be in the CO statement
                </li>
                <li>
                  <strong>B (Behavior):</strong> Must be explicitly present in
                  the CO statement
                </li>
                <li>
                  <strong>C (Condition):</strong> Must be explicitly present in
                  the CO statement
                </li>
                <li>
                  <strong>D (Degree):</strong> Must be explicitly present in the
                  CO statement
                </li>
              </ul>
              <p className="text-amber-800 mt-3">
                Each component (B, C, D) should be distinct — there must be no
                overlap between them.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <strong>Progress:</strong> {completedOutcomes} of{" "}
          {courseOutcomes.length} completed
        </p>
        {courseOutcomes.length > 0 &&
          completedOutcomes < courseOutcomes.length && (
            <div className="flex items-center text-amber-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">Complete all mappings to proceed</span>
            </div>
          )}
      </div>

      {courseOutcomes.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6 pb-6 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Course Outcomes
            </h3>
            <p className="text-gray-600 mb-4">
              You need to add course outcomes first before defining their ABCD
              models. Please go back to the Course Outcomes section to add
              outcomes.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Course Outcome Tabs */}
          <div className="bg-gray-100 p-1 rounded-lg">
            <div className="flex space-x-1">
              {courseOutcomes.map((outcome, index) => {
                const isComplete = isABCDComplete(outcome);
                const isActive = activeTab === index;

                return (
                  <button
                    key={outcome.id || `new-${index}`}
                    onClick={() => {
                      if (isEditing) {
                        // If currently editing, save changes first
                        saveChanges();
                      }
                      setActiveTab(index);
                    }}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    CO {index + 1}
                    {isComplete && (
                      <CheckCircle className="h-4 w-4 ml-2 text-green-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Course Outcome Content */}
          {currentOutcome && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center">
                      CO {activeTab + 1}: {currentOutcome.name}
                      {isABCDComplete(currentOutcome) && (
                        <Badge className="ml-3 bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid mapping
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {currentOutcome.statement}
                    </CardDescription>
                  </div>
                  {isEditing ? (
                    <div className="flex justify-end gap-2 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        disabled={
                          !currentOutcome ||
                          !isFormDataValid(currentOutcome, formData)
                        }
                        onClick={saveChanges}
                      >
                        {!currentOutcome ||
                        !isFormDataValid(currentOutcome, formData) ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Save className="h-4 w-4 mr-2" />
                                <span>Save Changes</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                ABCD components must be distinct,
                                non-overlapping, and present in the CO statement
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => startEditing(currentOutcome)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit ABCD Mapping
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Audience (A){" "}
                      <span className="text-gray-500">(Can be anything)</span>
                    </Label>
                    {isEditing ? (
                      <Input
                        placeholder="e.g., Students, Learners"
                        value={formData.audience}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            audience: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded border min-h-[2.5rem] flex items-center">
                        {currentData?.audience || (
                          <span className="text-gray-400 italic">
                            e.g., Students, Learners
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Behavior (B){" "}
                      <span className="text-red-500">
                        *Must be in CO statement
                      </span>
                    </Label>
                    {isEditing ? (
                      <>
                        <Input
                          placeholder="e.g., analyze, design, evaluate"
                          value={formData.behavior}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              behavior: e.target.value,
                            }))
                          }
                          className={`mt-1 ${
                            formData.behavior &&
                            !currentOutcome.statement
                              .toLowerCase()
                              .includes(formData.behavior.toLowerCase())
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {formData.behavior &&
                          !currentOutcome.statement
                            .toLowerCase()
                            .includes(formData.behavior.toLowerCase()) && (
                            <p className="text-xs text-red-500 mt-1">
                              This behavior is not found in the CO statement.
                            </p>
                          )}
                      </>
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded border min-h-[2.5rem] flex items-center">
                        {currentData?.behavior || (
                          <span className="text-gray-400 italic">
                            e.g., analyze, design, evaluate
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Condition (C){" "}
                      <span className="text-red-500">
                        *Must be in CO statement
                      </span>
                    </Label>
                    {isEditing ? (
                      <>
                        <Input
                          placeholder="e.g., using programming concepts, in a team"
                          value={formData.condition}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              condition: e.target.value,
                            }))
                          }
                          className={`mt-1 ${
                            formData.condition &&
                            !currentOutcome.statement
                              .toLowerCase()
                              .includes(formData.condition.toLowerCase())
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {formData.condition &&
                          !currentOutcome.statement
                            .toLowerCase()
                            .includes(formData.condition.toLowerCase()) && (
                            <p className="text-xs text-red-500 mt-1">
                              This condition is not found in the CO statement.
                            </p>
                          )}
                      </>
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded border min-h-[2.5rem] flex items-center">
                        {currentData?.condition || (
                          <span className="text-gray-400 italic">
                            e.g., using programming concepts, in a team
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Degree (D){" "}
                      <span className="text-red-500">
                        *Must be in CO statement
                      </span>
                    </Label>
                    {isEditing ? (
                      <>
                        <Input
                          placeholder="e.g., accurately, effectively"
                          value={formData.degree}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              degree: e.target.value,
                            }))
                          }
                          className={`mt-1 ${
                            formData.degree &&
                            !currentOutcome.statement
                              .toLowerCase()
                              .includes(formData.degree.toLowerCase())
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {formData.degree &&
                          !currentOutcome.statement
                            .toLowerCase()
                            .includes(formData.degree.toLowerCase()) && (
                            <p className="text-xs text-red-500 mt-1">
                              This degree is not found in the CO statement.
                            </p>
                          )}
                      </>
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded border min-h-[2.5rem] flex items-center">
                        {currentData?.degree || (
                          <span className="text-gray-400 italic">
                            e.g., accurately, effectively
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add overlap warning similar to ABCDMappingCard */}
                {isEditing &&
                  formData.behavior &&
                  formData.condition &&
                  formData.degree &&
                  (formData.behavior.toLowerCase() ===
                    formData.condition.toLowerCase() ||
                    formData.behavior.toLowerCase() ===
                      formData.degree.toLowerCase() ||
                    formData.condition.toLowerCase() ===
                      formData.degree.toLowerCase() ||
                    formData.behavior
                      .toLowerCase()
                      .includes(formData.condition.toLowerCase()) ||
                    formData.behavior
                      .toLowerCase()
                      .includes(formData.degree.toLowerCase()) ||
                    formData.condition
                      .toLowerCase()
                      .includes(formData.behavior.toLowerCase()) ||
                    formData.condition
                      .toLowerCase()
                      .includes(formData.degree.toLowerCase()) ||
                    formData.degree
                      .toLowerCase()
                      .includes(formData.behavior.toLowerCase()) ||
                    formData.degree
                      .toLowerCase()
                      .includes(formData.condition.toLowerCase())) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600 mt-4">
                      <strong>Warning:</strong> There is overlap between B, C,
                      and D components. Each component should be distinct.
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
