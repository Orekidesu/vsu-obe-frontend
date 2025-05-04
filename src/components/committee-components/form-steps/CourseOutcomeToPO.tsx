import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type {
  CourseOutcome,
  ProgramOutcome,
  CO_PO_Mapping,
} from "@/store/course/course-store";

import { CourseOutcomeInstructions } from "./course-po-components/CourseOutcomePOInstructions";
import { CourseOutcomeTabContent } from "./course-po-components/CourseOutcomeTabContent";
import { POSummaryTable } from "./course-po-components/POSummaryTable";

interface CourseOutcomesPOStepProps {
  courseOutcomes: CourseOutcome[];
  programOutcomes: ProgramOutcome[];
  poMappings: CO_PO_Mapping[];
  onUpdatePO: (
    courseOutcomeId: number,
    programOutcomeId: number,
    contributionLevel: "I" | "E" | "D" | null
  ) => void;
}

export function CourseOutcomesPOStep({
  courseOutcomes,
  programOutcomes,
  poMappings,
  onUpdatePO,
}: CourseOutcomesPOStepProps) {
  const [activeTab, setActiveTab] = useState<string>(
    courseOutcomes[0]?.id.toString() || "1"
  );

  // Helper function to get contribution level for a specific CO-PO pair
  const getContributionLevel = (
    courseOutcomeId: number,
    programOutcomeId: number
  ): "I" | "E" | "D" | null => {
    const mapping = poMappings.find(
      (m) =>
        m.courseOutcomeId === courseOutcomeId &&
        m.programOutcomeId === programOutcomeId
    );
    return mapping ? mapping.contributionLevel : null;
  };

  // Check if a CO has at least one PO mapping
  const hasAtLeastOnePOMapping = (courseOutcomeId: number): boolean => {
    return poMappings.some(
      (mapping) => mapping.courseOutcomeId === courseOutcomeId
    );
  };

  return (
    <div className="space-y-6">
      {/* Instructions and Legend */}
      <CourseOutcomeInstructions />

      {/* Tabs for Course Outcomes */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-4">
          {courseOutcomes.map((co) => (
            <TabsTrigger
              key={co.id}
              value={co.id.toString()}
              className="relative"
            >
              CO{co.id}
              {hasAtLeastOnePOMapping(co.id) ? (
                <CheckCircle2 className="h-3 w-3 text-green-500 absolute -top-1 -right-1" />
              ) : (
                <AlertCircle className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {courseOutcomes.map((co) => (
          <CourseOutcomeTabContent
            key={co.id}
            courseOutcome={co}
            programOutcomes={programOutcomes}
            getContributionLevel={getContributionLevel}
            hasAtLeastOnePOMapping={hasAtLeastOnePOMapping}
            onUpdatePO={onUpdatePO}
            activeTab={activeTab}
          />
        ))}
      </Tabs>

      {/* Summary Table */}
      <POSummaryTable
        courseOutcomes={courseOutcomes}
        programOutcomes={programOutcomes}
        getContributionLevel={getContributionLevel}
      />
    </div>
  );
}
