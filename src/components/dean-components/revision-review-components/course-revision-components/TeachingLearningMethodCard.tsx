import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  CourseOutcome,
  TeachingMethod,
  LearningResource,
} from "@/store/course/course-store";

interface TeachingLearningCardProps {
  courseOutcomes: CourseOutcome[] | null;
  teachingMethods: TeachingMethod[] | null;
  learningResources: LearningResource[] | null;
  title?: string;
}

export function TeachingLearningCard({
  courseOutcomes,
  teachingMethods,
  learningResources,
  title = "Teaching Methods & Learning Resources",
}: TeachingLearningCardProps) {
  // Create a mapping of teaching methods by ID for easier lookup
  const teachingMethodsMap = new Map<string, string>();
  teachingMethods?.forEach((method) => {
    teachingMethodsMap.set(method.id, method.name);
  });

  // Create a mapping of learning resources by ID for easier lookup
  const learningResourcesMap = new Map<string, string>();
  learningResources?.forEach((resource) => {
    learningResourcesMap.set(resource.id, resource.name);
  });

  // Function to get teaching methods for a course outcome
  const getTeachingMethodsForCO = (courseOutcomeId: number): string[] => {
    // In the transformed data, the teaching methods are already in string format
    // and are associated with the course outcome through the course outcome ID
    const methods: string[] = [];
    teachingMethods?.forEach((method) => {
      if (method.name.includes(courseOutcomeId.toString())) {
        methods.push(method.name);
      }
    });
    return methods;
  };

  // Function to get learning resources for a course outcome
  const getLearningResourcesForCO = (courseOutcomeId: number): string[] => {
    // Similar to teaching methods
    const resources: string[] = [];
    learningResources?.forEach((resource) => {
      if (resource.name.includes(courseOutcomeId.toString())) {
        resources.push(resource.name);
      }
    });
    return resources;
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
                  Teaching Methods
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Learning Resources
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courseOutcomes?.map((outcome) => {
                // Get teaching methods and learning resources for this course outcome
                const teachingMethodsList = getTeachingMethodsForCO(outcome.id);
                const learningResourcesList = getLearningResourcesForCO(
                  outcome.id
                );

                return (
                  <tr key={outcome.id}>
                    <td className="px-4 py-3 text-sm font-medium">
                      {outcome.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {teachingMethodsList.length > 0 ? (
                          teachingMethodsList.map((method, idx) => (
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
                        {learningResourcesList.length > 0 ? (
                          learningResourcesList.map((resource, idx) => (
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
