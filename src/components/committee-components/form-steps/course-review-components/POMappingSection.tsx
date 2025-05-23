import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import type {
  CourseOutcome,
  ProgramOutcome,
  CO_PO_Mapping,
} from "@/store/course/course-store";

interface POMappingSectionProps {
  courseOutcomes: CourseOutcome[];
  programOutcomes: ProgramOutcome[];
  poMappings: CO_PO_Mapping[];
  isExpanded: boolean;
  toggleSection: () => void;
  onEditStep: () => void;
}

export function POMappingSection({
  courseOutcomes,
  programOutcomes,
  poMappings,
  isExpanded,
  toggleSection,
  onEditStep,
}: POMappingSectionProps) {
  const getContributionLevelName = (level: string) => {
    const levels = {
      I: "Introductory",
      E: "Enabling",
      D: "Demonstrative",
    };

    return levels[level as keyof typeof levels] || level;
  };

  return (
    <Card className="border border-gray-200">
      <SectionHeader
        title="PO Mapping"
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
                  {programOutcomes.map((po) => (
                    <th
                      key={po.id}
                      className="px-4 py-2 text-center text-sm font-medium text-gray-500"
                    >
                      {po.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {courseOutcomes.map((outcome) => (
                  <tr key={outcome.id}>
                    <td className="px-4 py-3 text-sm">{outcome.name}</td>
                    {programOutcomes.map((po) => {
                      const mapping = poMappings.find(
                        (m) =>
                          m.courseOutcomeId === outcome.id &&
                          m.programOutcomeId === po.id
                      );
                      return (
                        <td
                          key={po.id}
                          className="px-4 py-3 text-sm text-center"
                        >
                          {mapping
                            ? getContributionLevelName(
                                mapping.contributionLevel
                              )
                            : "-"}
                        </td>
                      );
                    })}
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
