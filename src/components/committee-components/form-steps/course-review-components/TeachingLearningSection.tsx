import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import type {
  CourseOutcome,
  TeachingMethod,
  LearningResource,
} from "@/store/course/course-store";

interface TeachingLearningSectionProps {
  courseOutcomes: CourseOutcome[];
  teachingMethods: TeachingMethod[];
  learningResources: LearningResource[];
  getCOTeachingMethods: (courseOutcomeId: number) => string[];
  getCOLearningResources: (courseOutcomeId: number) => string[];
  getTeachingMethodName: (id: string) => string;
  getLearningResourceName: (id: string) => string;
  isExpanded: boolean;
  toggleSection: () => void;
  onEditStep: () => void;
}

export function TeachingLearningSection({
  courseOutcomes,
  // teachingMethods,
  // learningResources,
  getCOTeachingMethods,
  getCOLearningResources,
  getTeachingMethodName,
  getLearningResourceName,
  isExpanded,
  toggleSection,
  onEditStep,
}: TeachingLearningSectionProps) {
  return (
    <Card className="border border-gray-200">
      <SectionHeader
        title="Teaching Methods & Learning Resources"
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
                    Teaching Methods
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Learning Resources
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courseOutcomes.map((outcome) => {
                  const teachingMethodIds = getCOTeachingMethods(outcome.id);
                  const learningResourceIds = getCOLearningResources(
                    outcome.id
                  );

                  return (
                    <tr key={outcome.id}>
                      <td className="px-4 py-3 text-sm">{outcome.name}</td>
                      <td className="px-4 py-3 text-sm">
                        {teachingMethodIds.length > 0
                          ? teachingMethodIds
                              .map((id) => getTeachingMethodName(id))
                              .join(", ")
                          : "None selected"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {learningResourceIds.length > 0
                          ? learningResourceIds
                              .map((id) => getLearningResourceName(id))
                              .join(", ")
                          : "None selected"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
