import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import type {
  CourseOutcome,
  CO_ABCD_Mapping,
} from "@/store/course/course-store";

interface ABCDMappingSectionProps {
  courseOutcomes: CourseOutcome[];
  abcdMappings: CO_ABCD_Mapping[];
  isExpanded: boolean;
  toggleSection: () => void;
  onEditStep: () => void;
}

export function ABCDMappingSection({
  courseOutcomes,
  abcdMappings,
  isExpanded,
  toggleSection,
  onEditStep,
}: ABCDMappingSectionProps) {
  return (
    <Card className="border border-gray-200">
      <SectionHeader
        title="ABCD Mapping"
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
                    Audience
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Behavior
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Condition
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Degree
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courseOutcomes.map((outcome) => {
                  const mapping = abcdMappings.find(
                    (m) => m.co_id === outcome.id
                  );
                  return (
                    <tr key={outcome.id}>
                      <td className="px-4 py-3 text-sm">{outcome.name}</td>
                      <td className="px-4 py-3 text-sm">
                        {mapping?.audience || "Not specified"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {mapping?.behavior || "Not specified"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {mapping?.condition || "Not specified"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {mapping?.degree || "Not specified"}
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
