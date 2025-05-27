import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  CourseOutcome,
  AssessmentTask,
} from "@/store/course/course-store";

interface AssessmentTasksCardProps {
  courseOutcomes: CourseOutcome[] | null;
  assessmentTasks: AssessmentTask[] | null;
  title?: string;
}

export function AssessmentTasksCard({
  courseOutcomes,
  assessmentTasks,
  title = "Assessment Tasks",
}: AssessmentTasksCardProps) {
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
                  Assessment Tasks
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Weight
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courseOutcomes?.map((outcome) => {
                const tasks =
                  assessmentTasks?.filter(
                    (task) => task.courseOutcomeId === outcome.id
                  ) || [];

                if (tasks.length === 0) {
                  return (
                    <tr key={outcome.id}>
                      <td className="px-4 py-3 text-sm font-medium">
                        {outcome.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 italic">
                        No tasks defined
                      </td>
                      <td className="px-4 py-3 text-sm">-</td>
                    </tr>
                  );
                }

                return tasks.map((task, index) => (
                  <tr key={`${outcome.id}-${task.id}`}>
                    {index === 0 && (
                      <td
                        className="px-4 py-3 text-sm font-medium"
                        rowSpan={tasks.length}
                      >
                        {outcome.name}
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        {task.code && (
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2 py-0.5 rounded">
                            {task.code}
                          </span>
                        )}
                        <div>
                          <div className="font-medium">{task.name}</div>
                          {task.tool && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {task.tool}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="font-medium">{task.weight}%</span>
                    </td>
                  </tr>
                ));
              })}
              {(!courseOutcomes ||
                courseOutcomes.length === 0 ||
                !assessmentTasks) && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-3 text-sm text-gray-500 text-center"
                  >
                    No assessment tasks available
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
