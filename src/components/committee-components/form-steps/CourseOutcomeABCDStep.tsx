"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCourseDetailsStore,
  type CourseOutcome,
} from "@/store/course/course-store";
import { InfoIcon, CheckCircle2, AlertCircle } from "lucide-react";

export function CourseOutcomesABCDStep() {
  const { courseOutcomes, updateCourseOutcomeABCD, getABCDMappingForCO } =
    useCourseDetailsStore();
  const [activeTab, setActiveTab] = useState(
    `co-${courseOutcomes[0]?.id || 1}`
  );

  // Validation function to check if B, C, and D are in the CO statement
  const validateABCD = (
    outcome: CourseOutcome,
    behavior: string,
    condition: string,
    degree: string
  ) => {
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
    const hasOverlap = (a: string, b: string) => {
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

  // Check if all outcomes have valid ABCD mappings
  const allMappingsValid = courseOutcomes.every((outcome) => {
    const mapping = getABCDMappingForCO(outcome.id);
    if (!mapping) return false;
    return validateABCD(
      outcome,
      mapping.behavior,
      mapping.condition,
      mapping.degree
    );
  });

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Map Course Outcomes to ABCD Model
      </h2>

      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-start gap-3">
          <InfoIcon className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Instructions:</h3>
            <p className="text-sm text-amber-700 mt-1">
              Identify and extract the phrase or word from each CO statement
              that best represents each of the ABCD components:
            </p>
            <ul className="list-disc list-inside text-sm text-amber-700 mt-2 space-y-1">
              <li>
                <strong>A (Audience)</strong>: Can be anything, doesn&apos;t
                need to be in the CO statement
              </li>
              <li>
                <strong>B (Behavior)</strong>: Must be explicitly present in the
                CO statement
              </li>
              <li>
                <strong>C (Condition)</strong>: Must be explicitly present in
                the CO statement
              </li>
              <li>
                <strong>D (Degree)</strong>: Must be explicitly present in the
                CO statement
              </li>
            </ul>
            <p className="text-sm text-amber-700 mt-2">
              Each component (B, C, D) should be distinct — there must be no
              overlap between them.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Progress:</span>
          <span className="text-sm">
            {
              courseOutcomes.filter((co) => {
                const mapping = getABCDMappingForCO(co.id);
                return (
                  mapping &&
                  validateABCD(
                    co,
                    mapping.behavior,
                    mapping.condition,
                    mapping.degree
                  )
                );
              }).length
            }{" "}
            of {courseOutcomes.length} completed
          </span>
        </div>

        {allMappingsValid ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">All mappings complete</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Complete all mappings to proceed
            </span>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-auto">
          {courseOutcomes.map((outcome) => {
            const mapping = getABCDMappingForCO(outcome.id);
            const isValid =
              mapping &&
              validateABCD(
                outcome,
                mapping.behavior,
                mapping.condition,
                mapping.degree
              );

            return (
              <TabsTrigger
                key={outcome.id}
                value={`co-${outcome.id}`}
                className={`min-w-[100px] ${isValid ? "data-[state=active]:border-green-500" : ""}`}
              >
                CO {outcome.id}
                {isValid && (
                  <CheckCircle2 className="h-3 w-3 ml-1 text-green-600" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {courseOutcomes.map((outcome) => (
          <TabsContent
            key={outcome.id}
            value={`co-${outcome.id}`}
            className="mt-6"
          >
            <ABCDMappingCard
              outcome={outcome}
              existingMapping={getABCDMappingForCO(outcome.id)}
              onUpdate={(audience, behavior, condition, degree) =>
                updateCourseOutcomeABCD(
                  outcome.id,
                  audience,
                  behavior,
                  condition,
                  degree
                )
              }
              validateABCD={validateABCD}
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}

interface ABCDMappingCardProps {
  outcome: CourseOutcome;
  existingMapping?: {
    audience: string;
    behavior: string;
    condition: string;
    degree: string;
  };
  onUpdate: (
    audience: string,
    behavior: string,
    condition: string,
    degree: string
  ) => void;
  validateABCD: (
    outcome: CourseOutcome,
    behavior: string,
    condition: string,
    degree: string
  ) => boolean;
}

function ABCDMappingCard({
  outcome,
  existingMapping,
  onUpdate,
  validateABCD,
}: ABCDMappingCardProps) {
  // Get initial values from the existing mapping or empty strings
  const initialAudience = existingMapping?.audience || "";
  const initialBehavior = existingMapping?.behavior || "";
  const initialCondition = existingMapping?.condition || "";
  const initialDegree = existingMapping?.degree || "";

  // Local state for form values
  const [audience, setAudience] = useState(initialAudience);
  const [behavior, setBehavior] = useState(initialBehavior);
  const [condition, setCondition] = useState(initialCondition);
  const [degree, setDegree] = useState(initialDegree);

  // Update local state when the existing mapping changes
  useEffect(() => {
    if (existingMapping) {
      setAudience(existingMapping.audience);
      setBehavior(existingMapping.behavior);
      setCondition(existingMapping.condition);
      setDegree(existingMapping.degree);
    }
  }, [existingMapping]);

  // Check if the current values are valid
  const isValid = validateABCD(outcome, behavior, condition, degree);

  // Auto-save when values change
  useEffect(() => {
    // Debounce the update to avoid too many state changes
    const timer = setTimeout(() => {
      onUpdate(audience, behavior, condition, degree);
    }, 500);

    return () => clearTimeout(timer);
  }, [audience, behavior, condition, degree, onUpdate]);

  return (
    <Card className={`border ${isValid ? "border-green-200" : ""}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>
            CO {outcome.id}: {outcome.name}
          </span>
          {isValid && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Valid mapping</span>
            </div>
          )}
        </CardTitle>
        <CardDescription className="text-base mt-2 whitespace-pre-wrap">
          {outcome.statement}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor={`audience-${outcome.id}`}
                className="flex items-center gap-2"
              >
                Audience (A)
                <span className="text-xs text-muted-foreground">
                  (Can be anything)
                </span>
              </Label>
              <Input
                id={`audience-${outcome.id}`}
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., Students, Learners"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`behavior-${outcome.id}`}
                className="flex items-center gap-2"
              >
                Behavior (B)
                <span className="text-xs text-red-500">
                  *Must be in CO statement
                </span>
              </Label>
              <Input
                id={`behavior-${outcome.id}`}
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                placeholder="e.g., analyze, design, evaluate"
                className={`w-full ${behavior && !outcome.statement.toLowerCase().includes(behavior.toLowerCase()) ? "border-red-500" : ""}`}
              />
              {behavior &&
                !outcome.statement
                  .toLowerCase()
                  .includes(behavior.toLowerCase()) && (
                  <p className="text-xs text-red-500">
                    This behavior is not found in the CO statement.
                  </p>
                )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`condition-${outcome.id}`}
                className="flex items-center gap-2"
              >
                Condition (C)
                <span className="text-xs text-red-500">
                  *Must be in CO statement
                </span>
              </Label>
              <Input
                id={`condition-${outcome.id}`}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="e.g., using programming concepts, in a team"
                className={`w-full ${condition && !outcome.statement.toLowerCase().includes(condition.toLowerCase()) ? "border-red-500" : ""}`}
              />
              {condition &&
                !outcome.statement
                  .toLowerCase()
                  .includes(condition.toLowerCase()) && (
                  <p className="text-xs text-red-500">
                    This condition is not found in the CO statement.
                  </p>
                )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`degree-${outcome.id}`}
                className="flex items-center gap-2"
              >
                Degree (D)
                <span className="text-xs text-red-500">
                  *Must be in CO statement
                </span>
              </Label>
              <Input
                id={`degree-${outcome.id}`}
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g., accurately, effectively"
                className={`w-full ${degree && !outcome.statement.toLowerCase().includes(degree.toLowerCase()) ? "border-red-500" : ""}`}
              />
              {degree &&
                !outcome.statement
                  .toLowerCase()
                  .includes(degree.toLowerCase()) && (
                  <p className="text-xs text-red-500">
                    This degree is not found in the CO statement.
                  </p>
                )}
            </div>
          </div>

          {/* Overlap warning */}
          {behavior &&
            condition &&
            degree &&
            (behavior.toLowerCase() === condition.toLowerCase() ||
              behavior.toLowerCase() === degree.toLowerCase() ||
              condition.toLowerCase() === degree.toLowerCase() ||
              behavior.toLowerCase().includes(condition.toLowerCase()) ||
              behavior.toLowerCase().includes(degree.toLowerCase()) ||
              condition.toLowerCase().includes(behavior.toLowerCase()) ||
              condition.toLowerCase().includes(degree.toLowerCase()) ||
              degree.toLowerCase().includes(behavior.toLowerCase()) ||
              degree.toLowerCase().includes(condition.toLowerCase())) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                <strong>Warning:</strong> There is overlap between B, C, and D
                components. Each component should be distinct.
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
