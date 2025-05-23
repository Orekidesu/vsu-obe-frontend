import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import type { CourseOutcome } from "@/store/course/course-store";

interface CourseOutcomesSectionProps {
  courseOutcomes: CourseOutcome[];
  isExpanded: boolean;
  toggleSection: () => void;
  onEditStep: () => void;
}

export function CourseOutcomesSection({
  courseOutcomes,
  isExpanded,
  toggleSection,
  onEditStep,
}: CourseOutcomesSectionProps) {
  return (
    <Card className="border border-gray-200">
      <SectionHeader
        title="Course Outcomes"
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
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Statement
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courseOutcomes.map((outcome) => (
                  <tr key={outcome.id}>
                    <td className="px-4 py-3 text-sm">{outcome.name}</td>
                    <td className="px-4 py-3 text-sm">{outcome.name}</td>
                    <td className="px-4 py-3 text-sm">{outcome.statement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
