import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TLAMethodTeaching } from "./TLAMethodTeaching";
import { TLAMethodLearning } from "./TLAMethodLearning";
import type { CourseOutcome } from "@/store/revision/course-revision-store";

interface TLAMethodTabContentProps {
  outcome: CourseOutcome;
  coIndex: number;
  allTeachingMethods: string[];
  allLearningResources: string[];
  handleTeachingMethodChange: (method: string, checked: boolean) => void;
  handleLearningResourceChange: (resource: string, checked: boolean) => void;
  newTeachingMethod: string;
  setNewTeachingMethod: (value: string) => void;
  handleAddTeachingMethod: () => void;
  newLearningResource: string;
  setNewLearningResource: (value: string) => void;
  handleAddLearningResource: () => void;
}

export function TLAMethodTabContent({
  outcome,
  coIndex,
  allTeachingMethods,
  allLearningResources,
  handleTeachingMethodChange,
  handleLearningResourceChange,
  newTeachingMethod,
  setNewTeachingMethod,
  handleAddTeachingMethod,
  newLearningResource,
  setNewLearningResource,
  handleAddLearningResource,
}: TLAMethodTabContentProps) {
  const selectedTeachingMethods =
    outcome.tla_assessment_method?.teaching_methods || [];
  const selectedLearningResources =
    outcome.tla_assessment_method?.learning_resources || [];

  return (
    <TabsContent value={coIndex.toString()} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Course Outcome {coIndex + 1}
          </CardTitle>
          <CardDescription>{outcome.statement}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teaching Methods */}
            <TLAMethodTeaching
              coIndex={coIndex}
              methods={allTeachingMethods}
              selectedMethods={selectedTeachingMethods}
              handleMethodChange={handleTeachingMethodChange}
              newMethod={newTeachingMethod}
              setNewMethod={setNewTeachingMethod}
              handleAddMethod={handleAddTeachingMethod}
            />

            {/* Learning Resources */}
            <TLAMethodLearning
              coIndex={coIndex}
              resources={allLearningResources}
              selectedResources={selectedLearningResources}
              handleResourceChange={handleLearningResourceChange}
              newResource={newLearningResource}
              setNewResource={setNewLearningResource}
              handleAddResource={handleAddLearningResource}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
