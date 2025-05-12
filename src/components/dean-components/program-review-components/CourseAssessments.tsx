import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CourseOutcome {
  id: number;
  name: string;
  statement: string;
  tla_tasks: Array<{
    id: number;
    at_code: string;
    at_name: string;
    at_tool: string;
    weight: string;
  }>;
  tla_assessment_method: {
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
    const totalWeight = outcome.tla_tasks.reduce(
      (sum, task) => sum + Number.parseFloat(task.weight || "0"),
      0
    );
    return { ...outcome, totalWeight };
  });

  return (
    <div className="space-y-6">
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
                  {outcome.tla_assessment_method?.teaching_methods?.length >
                  0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {outcome.tla_assessment_method.teaching_methods.map(
                        (method, index) => (
                          <li key={index} className="text-sm">
                            {method}
                          </li>
                        )
                      )}
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
                  {outcome.tla_assessment_method?.learning_resources?.length >
                  0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {outcome.tla_assessment_method.learning_resources.map(
                        (resource, index) => (
                          <li key={index} className="text-sm">
                            {resource}
                          </li>
                        )
                      )}
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
