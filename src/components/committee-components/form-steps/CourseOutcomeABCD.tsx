import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, InfoIcon } from "lucide-react";
import { CourseOutcome, CO_ABCD_Mapping } from "@/store/course/course-store";
// Define props interface
import { ABCDMappingCard } from "@/components/committee-components/ABCDMappingCard";
interface CourseOutcomesABCDStepProps {
  courseOutcomes: CourseOutcome[];
  coAbcdMappings: CO_ABCD_Mapping[];
  updateCourseOutcomeABCD: (
    co_id: number,
    audience: string,
    behavior: string,
    condition: string,
    degree: string
  ) => void;
  getABCDMappingForCO: (co_id: number) => CO_ABCD_Mapping | undefined;
  validateABCD: (
    outcome: CourseOutcome,
    behavior: string,
    condition: string,
    degree: string
  ) => boolean;
}

export function CourseOutcomesABCDStep({
  courseOutcomes,
  updateCourseOutcomeABCD,
  getABCDMappingForCO,
  validateABCD,
}: CourseOutcomesABCDStepProps) {
  const [activeTab, setActiveTab] = useState(
    `co-${courseOutcomes[0]?.id || 1}`
  );

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
        {/* Instructions content remains the same */}
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
