"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Brain,
  HandMetal,
  Heart,
  CheckCircle2,
  AlertCircle,
  InfoIcon,
} from "lucide-react";
import { useCourseDetailsStore } from "@/store/course/course-store";

export function CourseOutcomesCPAStep() {
  const {
    courseOutcomes,
    coCpaMappings,
    updateCourseOutcomeCPA,
    getCPAMappingForCO,
  } = useCourseDetailsStore();
  const [activeTab, setActiveTab] = useState(
    courseOutcomes[0]?.id.toString() || "1"
  );

  // Count completed mappings
  const completedCount = courseOutcomes.filter((outcome) => {
    const mapping = getCPAMappingForCO(outcome.id);
    return mapping && mapping.domain !== null;
  }).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          Course Outcomes (COs) - CPA Classification
        </h2>
      </div>

      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-start gap-3">
          <InfoIcon className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Instructions:</h3>
            <p className="text-sm text-amber-700 mt-1">
              Classify each Course Outcome (CO) into one of the following
              learning domains:
            </p>
            <ul className="list-disc list-inside text-sm text-amber-700 mt-2 space-y-1">
              <li>
                <strong>Cognitive (C)</strong>: Knowledge, comprehension,
                application, analysis, synthesis, evaluation
              </li>
              <li>
                <strong>Psychomotor (P)</strong>: Physical skills, coordination,
                technical abilities
              </li>
              <li>
                <strong>Affective (A)</strong>: Attitudes, feelings, values,
                beliefs, interests
              </li>
            </ul>
            <p className="text-sm text-amber-700 mt-2">
              Each CO must be classified under exactly one domain.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Progress:</span>
          <span className="text-sm">
            {completedCount} of {courseOutcomes.length} completed
          </span>
        </div>

        {completedCount === courseOutcomes.length ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">
              All classifications complete
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Complete all classifications to proceed
            </span>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-auto">
          {courseOutcomes.map((outcome) => {
            const mapping = getCPAMappingForCO(outcome.id);
            const isComplete = mapping && mapping.domain !== null;

            return (
              <TabsTrigger
                key={outcome.id}
                value={outcome.id.toString()}
                className={`min-w-[100px] ${isComplete ? "data-[state=active]:border-green-500" : ""}`}
              >
                CO {outcome.id}
                {isComplete && (
                  <CheckCircle2 className="h-3 w-3 ml-1 text-green-600" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {courseOutcomes.map((outcome) => (
          <TabsContent key={outcome.id} value={outcome.id.toString()}>
            <CPAMappingCard outcome={outcome} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function CPAMappingCard({
  outcome,
}: {
  outcome: { id: number; name: string; statement: string };
}) {
  const { getCPAMappingForCO, updateCourseOutcomeCPA } =
    useCourseDetailsStore();
  const existingMapping = getCPAMappingForCO(outcome.id);
  const [domain, setDomain] = useState<
    "cognitive" | "psychomotor" | "affective" | null
  >(existingMapping?.domain || null);

  // Update local state when the existing mapping changes
  useEffect(() => {
    if (existingMapping) {
      setDomain(existingMapping.domain);
    }
  }, [existingMapping]);

  // Update the store when the domain changes
  const handleDomainChange = (
    value: "cognitive" | "psychomotor" | "affective"
  ) => {
    setDomain(value);
    updateCourseOutcomeCPA(outcome.id, value);
  };

  return (
    <Card className={`border ${domain ? "border-green-200" : ""}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>
            CO {outcome.id}: {outcome.name}
          </span>
          {domain && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Valid classification</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="font-medium">Statement:</p>
          <p className="whitespace-pre-wrap">{outcome.statement}</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Select one learning domain:</p>
          <RadioGroup value={domain || ""} onValueChange={handleDomainChange}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`border rounded-md p-4 ${domain === "cognitive" ? "bg-blue-50 border-blue-300" : ""}`}
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem
                    value="cognitive"
                    id={`cognitive-${outcome.id}`}
                  />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor={`cognitive-${outcome.id}`}
                      className="flex items-center"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Cognitive (C)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Knowledge, comprehension, application, analysis,
                      synthesis, evaluation
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-md p-4 ${domain === "psychomotor" ? "bg-purple-50 border-purple-300" : ""}`}
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem
                    value="psychomotor"
                    id={`psychomotor-${outcome.id}`}
                  />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor={`psychomotor-${outcome.id}`}
                      className="flex items-center"
                    >
                      <HandMetal className="h-4 w-4 mr-2" />
                      Psychomotor (P)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Physical skills, coordination, technical abilities
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-md p-4 ${domain === "affective" ? "bg-rose-50 border-rose-300" : ""}`}
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem
                    value="affective"
                    id={`affective-${outcome.id}`}
                  />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor={`affective-${outcome.id}`}
                      className="flex items-center"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Affective (A)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Attitudes, feelings, values, beliefs, interests
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        {!domain && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              Please select exactly one learning domain for this Course Outcome.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
