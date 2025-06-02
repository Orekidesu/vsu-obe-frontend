import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RawCourseOutcome } from "@/components/dean-components/revision-review-components/types";

interface TeachingLearningCardProps {
  courseOutcomes: RawCourseOutcome[] | null | undefined;
  title?: string;
}

export function TeachingLearningCard({
  courseOutcomes,
  title = "Teaching Methods & Learning Resources",
}: TeachingLearningCardProps) {
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
                  Teaching Methods
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Learning Resources
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courseOutcomes?.map((outcome) => {
                // Get teaching methods and learning resources directly from the course outcome
                const teachingMethods =
                  outcome.tla_assessment_method?.teaching_methods || [];
                const learningResources =
                  outcome.tla_assessment_method?.learning_resources || [];

                return (
                  <tr key={outcome.id}>
                    <td className="px-4 py-3 text-sm font-medium">
                      {outcome.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {teachingMethods.length > 0 ? (
                          teachingMethods.map((method, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded"
                            >
                              {method}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 italic">
                            No methods specified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {learningResources.length > 0 ? (
                          learningResources.map((resource, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded"
                            >
                              {resource}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 italic">
                            No resources specified
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(!courseOutcomes || courseOutcomes.length === 0) && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-3 text-sm text-gray-500 text-center"
                  >
                    No teaching or learning data available
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
