import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  CourseOutcome,
  CO_ABCD_Mapping,
} from "@/store/course/course-store";

interface ABCDMappingCardProps {
  courseOutcomes: CourseOutcome[] | null;
  abcdMappings: CO_ABCD_Mapping[] | null;
  title?: string;
}

export function ABCDMappingCard({
  courseOutcomes,
  abcdMappings,
  title = "ABCD Mapping",
}: ABCDMappingCardProps) {
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
              {courseOutcomes?.map((outcome) => {
                const mapping = abcdMappings?.find(
                  (m) => m.co_id === outcome.id
                );
                return (
                  <tr key={outcome.id}>
                    <td className="px-4 py-3 text-sm font-medium">
                      {outcome.name}
                    </td>
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
              {(!courseOutcomes || courseOutcomes.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-sm text-gray-500 text-center"
                  >
                    No ABCD mappings available
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
