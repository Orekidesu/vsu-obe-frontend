import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import type {
  CourseOutcome,
  AssessmentTask,
} from "@/store/course/course-store";

interface AssessmentTasksSectionProps {
  courseOutcomes: CourseOutcome[];
  assessmentTasks: AssessmentTask[];
  isExpanded: boolean;
  toggleSection: () => void;
  onEditStep: () => void;
}

export function AssessmentTasksSection({
  courseOutcomes,
  assessmentTasks,
  isExpanded,
  toggleSection,
  onEditStep,
}: AssessmentTasksSectionProps) {
  return (
    <Card className="border border-gray-200">
      <SectionHeader
        title="Assessment Tasks"
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
                    Assessment Tasks
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courseOutcomes.map((outcome) => {
                  const tasks = assessmentTasks.filter(
                    (task) => task.courseOutcomeId === outcome.id
                  );

                  if (tasks.length === 0) {
                    return (
                      <tr key={outcome.id}>
                        <td className="px-4 py-3 text-sm">{outcome.name}</td>
                        <td className="px-4 py-3 text-sm">No tasks defined</td>
                        <td className="px-4 py-3 text-sm">0%</td>
                      </tr>
                    );
                  }

                  return tasks.map((task, index) => (
                    <tr key={`${outcome.id}-${task.id}`}>
                      {index === 0 && (
                        <td
                          className="px-4 py-3 text-sm"
                          rowSpan={tasks.length}
                        >
                          {outcome.name}
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm">
                        {task.code && task.name
                          ? `${task.code}: ${task.name} (${task.tool})`
                          : task.code
                            ? `${task.code} (${task.tool})`
                            : task.name
                              ? `${task.name} (${task.tool})`
                              : `Unnamed Task (${task.tool})`}
                      </td>
                      <td className="px-4 py-3 text-sm">{task.weight}%</td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
