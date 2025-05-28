import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  CourseOutcome,
  CO_CPA_Mapping,
} from "@/store/course/course-store";

interface CPAClassificationCardProps {
  courseOutcomes: CourseOutcome[] | null;
  cpaMappings: CO_CPA_Mapping[] | null;
  title?: string;
}

export function CPAClassificationCard({
  courseOutcomes,
  cpaMappings,
  title = "CPA Classification",
}: CPAClassificationCardProps) {
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
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Domain
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courseOutcomes?.map((outcome) => {
                const mapping = cpaMappings?.find(
                  (m) => m.courseOutcomeId === outcome.id
                );
                return (
                  <tr key={outcome.id}>
                    <td className="px-4 py-3 text-sm font-medium">
                      {outcome.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          mapping?.domain === "cognitive"
                            ? "bg-blue-100 text-blue-800"
                            : mapping?.domain === "psychomotor"
                              ? "bg-green-100 text-green-800"
                              : mapping?.domain === "affective"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getDomainName(mapping?.domain || null)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {(!courseOutcomes || courseOutcomes.length === 0) && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-3 text-sm text-gray-500 text-center"
                  >
                    No CPA classifications available
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
