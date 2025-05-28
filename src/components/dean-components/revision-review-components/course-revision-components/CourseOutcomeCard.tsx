import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseOutcome } from "@/store/course/course-store";

interface CourseOutcomeCardProps {
  courseOutcomes: CourseOutcome[] | null;
  title?: string; // Optional custom title
}

export function CourseOutcomeCard({
  courseOutcomes,
  title = "Course Outcomes",
}: CourseOutcomeCardProps) {
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
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Statement
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courseOutcomes?.map((outcome) => (
                <tr key={outcome.id}>
                  <td className="px-4 py-3 text-sm font-medium">
                    {outcome.name}
                  </td>
                  <td className="px-4 py-3 text-sm">{outcome.statement}</td>
                </tr>
              ))}
              {(!courseOutcomes || courseOutcomes.length === 0) && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-3 text-sm text-gray-500 text-center"
                  >
                    No course outcomes available
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
