import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CourseOutcome {
  id: number;
  name: string;
  statement: string;
  tla_tasks?: Array<{
    id: number;
    at_code: string;
    at_name: string;
    at_tool: string;
    weight: string;
  }>;
  tla_assessment_method?: {
    teaching_methods: string[];
    learning_resources: string[];
  };
}

interface CourseAssessmentsProps {
  outcomes: CourseOutcome[];
}

export function CourseAssessments({ outcomes }: CourseAssessmentsProps) {
  if (!outcomes || outcomes.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">
          No assessment information available
        </p>
      </div>
    );
  }

  // Calculate total weight for each outcome
  const outcomesWithTotalWeight = outcomes.map((outcome) => {
    const totalWeight = (outcome.tla_tasks || []).reduce(
      (sum, task) => sum + Number.parseFloat(task.weight || "0"),
      0
    );
    return { ...outcome, totalWeight };
  });

  // Calculate overall weight across all outcomes
  const overallWeight = outcomesWithTotalWeight.reduce(
    (sum, outcome) => sum + outcome.totalWeight,
    0
  );

  return (
    <div className="space-y-6">
      {/* Overall Assessment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  Overall Assessment Weight
                </h3>
                <p className="text-sm text-muted-foreground">
                  Total weight across all course outcomes
                </p>
              </div>
              <Badge className="text-lg px-3 py-1 bg-primary/90 text-white">
                {overallWeight.toFixed(2)}%
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Course Outcomes
                </h4>
                <div className="space-y-2">
                  {outcomesWithTotalWeight.map((outcome) => (
                    <div
                      key={outcome.id}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                    >
                      <span className="text-sm font-medium">
                        {outcome.name}
                      </span>
                      <Badge variant="outline">
                        {outcome.totalWeight.toFixed(2)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Assessment Distribution
                </h4>
                <div className="h-[150px] relative rounded-md overflow-hidden bg-muted/30">
                  {outcomesWithTotalWeight.map((outcome, index, array) => {
                    // Calculate the percentage of this outcome relative to the overall weight
                    const percentage =
                      (outcome.totalWeight / overallWeight) * 100;

                    // Calculate the position based on previous outcomes
                    const previousPercentage = array
                      .slice(0, index)
                      .reduce(
                        (sum, o) => sum + (o.totalWeight / overallWeight) * 100,
                        0
                      );

                    return (
                      <div
                        key={outcome.id}
                        className="absolute h-full"
                        style={{
                          width: `${percentage}%`,
                          left: `${previousPercentage}%`,
                          backgroundColor: getColorForIndex(index),
                        }}
                      >
                        <div className="h-full flex items-center justify-center text-white text-xs font-bold">
                          {percentage > 10 ? `${outcome.name}` : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {outcomesWithTotalWeight.map((outcome, index) => (
                    <div
                      key={outcome.id}
                      className="flex items-center gap-1 text-xs"
                    >
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: getColorForIndex(index) }}
                      ></div>
                      <span>
                        {outcome.name}:{" "}
                        {((outcome.totalWeight / overallWeight) * 100).toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Tasks by Course Outcome */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Tasks by Course Outcome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {outcomesWithTotalWeight.map((outcome) => (
            <div key={outcome.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{outcome.name}</h3>
                <Badge variant="outline">
                  Total: {outcome.totalWeight.toFixed(2)}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {outcome.statement}
              </p>

              {outcome.tla_tasks && outcome.tla_tasks.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Code
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Tool
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium">
                          Weight
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {outcome.tla_tasks.map((task) => (
                        <tr key={task.id} className="border-t">
                          <td className="px-4 py-2 text-sm">{task.at_code}</td>
                          <td className="px-4 py-2 text-sm">{task.at_name}</td>
                          <td className="px-4 py-2 text-sm">{task.at_tool}</td>
                          <td className="px-4 py-2 text-sm text-right">
                            {task.weight}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  No assessment tasks defined
                </p>
              )}

              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Teaching and Learning Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Teaching and Learning Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {outcomesWithTotalWeight.map((outcome) => (
            <div key={outcome.id} className="space-y-3">
              <h3 className="text-lg font-medium">{outcome.name}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Teaching Methods
                  </h4>
                  {(outcome.tla_assessment_method?.teaching_methods || [])
                    .length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {(
                        outcome.tla_assessment_method?.teaching_methods || []
                      ).map((method, index) => (
                        <li key={index} className="text-sm">
                          {method}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      No teaching methods defined
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Learning Resources
                  </h4>
                  {(outcome.tla_assessment_method?.learning_resources || [])
                    .length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {(
                        outcome.tla_assessment_method?.learning_resources || []
                      ).map((resource, index) => (
                        <li key={index} className="text-sm">
                          {resource}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      No learning resources defined
                    </p>
                  )}
                </div>
              </div>

              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get a color based on index
function getColorForIndex(index: number): string {
  const colors = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#f97316", // orange-500
    "#6366f1", // indigo-500
    "#84cc16", // lime-500
    "#14b8a6", // teal-500
    "#eab308", // yellow-500
    "#ef4444", // red-500
    "#a855f7", // purple-500
  ];

  return colors[index % colors.length];
}
