import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import type {
  CourseOutcome,
  CO_CPA_Mapping,
} from "@/store/course/course-store";

interface CPAClassificationSectionProps {
  courseOutcomes: CourseOutcome[];
  cpaMappings: CO_CPA_Mapping[];
  isExpanded: boolean;
  toggleSection: () => void;
  onEditStep: () => void;
}

export function CPAClassificationSection({
  courseOutcomes,
  cpaMappings,
  isExpanded,
  toggleSection,
  onEditStep,
}: CPAClassificationSectionProps) {
  const getDomainName = (domain: string | null) => {
    if (!domain) return "Not classified";

    const domains = {
      cognitive: "Cognitive",
      psychomotor: "Psychomotor",
      affective: "Affective",
    };

    return domains[domain as keyof typeof domains] || "Unknown";
  };

  return (
    <Card className="border border-gray-200">
      <SectionHeader
        title="CPA Classification"
        isExpanded={isExpanded}
        toggleSection={toggleSection}
        onEditStep={onEditStep}
      />

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    CO
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Domain
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courseOutcomes.map((outcome) => {
                  const mapping = cpaMappings.find(
                    (m) => m.courseOutcomeId === outcome.id
                  );
                  return (
                    <tr key={outcome.id}>
                      <td className="px-4 py-3 text-sm">{outcome.name}</td>
                      <td className="px-4 py-3 text-sm">
                        {getDomainName(mapping?.domain || null)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
