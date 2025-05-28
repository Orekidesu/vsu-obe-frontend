import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  CourseOutcome,
  ProgramOutcome,
  CO_PO_Mapping,
} from "@/store/course/course-store";

interface POMappingCardProps {
  courseOutcomes: CourseOutcome[] | null;
  programOutcomes: ProgramOutcome[] | null;
  poMappings: CO_PO_Mapping[] | null;
  title?: string;
}

export function POMappingCard({
  courseOutcomes,
  programOutcomes,
  poMappings,
  title = "PO Mapping",
}: POMappingCardProps) {
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
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  CO
                </th>
                {programOutcomes?.map((po) => (
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
              {courseOutcomes?.map((outcome) => (
                <tr key={outcome.id}>
                  <td className="px-4 py-3 text-sm font-medium">
                    {outcome.name}
                  </td>
                  {programOutcomes?.map((po) => {
                    const mapping = poMappings?.find(
                      (m) =>
                        m.courseOutcomeId === outcome.id &&
                        m.programOutcomeId === po.id
                    );
                    return (
                      <td key={po.id} className="px-4 py-3 text-sm text-center">
                        {mapping ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              mapping.contributionLevel === "I"
                                ? "bg-blue-100 text-blue-800"
                                : mapping.contributionLevel === "E"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {getContributionLevelName(
                              mapping.contributionLevel
                            )}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {(!courseOutcomes ||
                courseOutcomes.length === 0 ||
                !programOutcomes ||
                programOutcomes.length === 0) && (
                <tr>
                  <td
                    colSpan={
                      programOutcomes?.length ? programOutcomes.length + 1 : 2
                    }
                    className="px-4 py-3 text-sm text-gray-500 text-center"
                  >
                    No PO mappings available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
