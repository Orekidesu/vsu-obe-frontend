import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  CourseOutcome,
  TeachingMethod,
  LearningResource,
} from "@/store/course/course-store";

import { TeachingMethodsSection } from "./TMLRTeachingMethod";
import { LearningResourcesSection } from "./TMLRLearningResources";

interface CourseOutcomeTabProps {
  courseOutcome: CourseOutcome;
  teachingMethods: TeachingMethod[];
  learningResources: LearningResource[];
  selectedMethods: string[];
  selectedResources: string[];
  toggleTeachingMethod: (courseOutcomeId: number, methodId: string) => void;
  toggleLearningResource: (courseOutcomeId: number, resourceId: string) => void;
  newTeachingMethod: string;
  setNewTeachingMethod: (value: string) => void;
  handleAddTeachingMethod: () => void;
  newLearningResource: string;
  setNewLearningResource: (value: string) => void;
  handleAddLearningResource: () => void;
}

export function CourseOutcomeTab({
  courseOutcome,
  teachingMethods,
  learningResources,
  selectedMethods,
  selectedResources,
  toggleTeachingMethod,
  toggleLearningResource,
  newTeachingMethod,
  setNewTeachingMethod,
  handleAddTeachingMethod,
  newLearningResource,
  setNewLearningResource,
  handleAddLearningResource,
}: CourseOutcomeTabProps) {
  return (
    <TabsContent
      key={courseOutcome.id}
      value={courseOutcome.id.toString()}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Course Outcome {courseOutcome.id}
          </CardTitle>
          <CardDescription>{courseOutcome.statement}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teaching Methods */}
            <TeachingMethodsSection
              courseOutcome={courseOutcome}
              teachingMethods={teachingMethods}
              selectedMethods={selectedMethods}
              toggleTeachingMethod={toggleTeachingMethod}
              newTeachingMethod={newTeachingMethod}
              setNewTeachingMethod={setNewTeachingMethod}
              handleAddTeachingMethod={handleAddTeachingMethod}
            />

            {/* Learning Resources */}
            <LearningResourcesSection
              courseOutcome={courseOutcome}
              learningResources={learningResources}
              selectedResources={selectedResources}
              toggleLearningResource={toggleLearningResource}
              newLearningResource={newLearningResource}
              setNewLearningResource={setNewLearningResource}
              handleAddLearningResource={handleAddLearningResource}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
