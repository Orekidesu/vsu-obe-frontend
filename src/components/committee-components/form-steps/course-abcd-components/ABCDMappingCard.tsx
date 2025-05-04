// Keep this component as a separate, reusable component
import { CourseOutcome } from "@/store/course/course-store";
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

import { CheckCircle2 } from "lucide-react";
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

export function ABCDMappingCard({
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
