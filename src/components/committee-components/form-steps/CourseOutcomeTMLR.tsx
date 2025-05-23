import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type {
  CourseOutcome,
  TeachingMethod,
  LearningResource,
} from "@/store/course/course-store";

import { TMLRInstructions } from "./course-tmlr-components/TMLRInstructions";
import { CourseOutcomeTab } from "./course-tmlr-components/TMLRTabContent";
import { SummaryTable } from "./course-tmlr-components/TMLRSummaryTable";

interface CourseOutcomesTLStepProps {
  courseOutcomes: CourseOutcome[];
  teachingMethods: TeachingMethod[];
  learningResources: LearningResource[];
  addTeachingMethod: (name: string) => void;
  removeTeachingMethod: (id: string) => void;
  addLearningResource: (name: string) => void;
  removeLearningResource: (id: string) => void;
  getCOTeachingMethods: (courseOutcomeId: number) => string[];
  getCOLearningResources: (courseOutcomeId: number) => string[];
  updateCOTeachingMethods: (
    courseOutcomeId: number,
    methodIds: string[]
  ) => void;
  updateCOLearningResources: (
    courseOutcomeId: number,
    resourceIds: string[]
  ) => void;
}

export function CourseOutcomesTLStep({
  courseOutcomes,
  teachingMethods,
  learningResources,
  addTeachingMethod,
  addLearningResource,
  getCOTeachingMethods,
  getCOLearningResources,
  updateCOTeachingMethods,
  updateCOLearningResources,
}: CourseOutcomesTLStepProps) {
  const [activeTab, setActiveTab] = useState<string>(
    courseOutcomes[0]?.id.toString() || "1"
  );
  const [newTeachingMethod, setNewTeachingMethod] = useState("");
  const [newLearningResource, setNewLearningResource] = useState("");

  // Helper function to check if a CO has at least one teaching method
  const hasAtLeastOneTeachingMethod = (courseOutcomeId: number): boolean => {
    const methods = getCOTeachingMethods(courseOutcomeId);
    return methods.length > 0;
  };

  // Helper function to check if a CO has at least one learning resource
  const hasAtLeastOneLearningResource = (courseOutcomeId: number): boolean => {
    const resources = getCOLearningResources(courseOutcomeId);
    return resources.length > 0;
  };

  // Helper function to toggle a teaching method for a CO
  const toggleTeachingMethod = (courseOutcomeId: number, methodId: string) => {
    const currentMethods = getCOTeachingMethods(courseOutcomeId);
    const updatedMethods = currentMethods.includes(methodId)
      ? currentMethods.filter((id) => id !== methodId)
      : [...currentMethods, methodId];
    updateCOTeachingMethods(courseOutcomeId, updatedMethods);
  };

  // Helper function to toggle a learning resource for a CO
  const toggleLearningResource = (
    courseOutcomeId: number,
    resourceId: string
  ) => {
    const currentResources = getCOLearningResources(courseOutcomeId);
    const updatedResources = currentResources.includes(resourceId)
      ? currentResources.filter((id) => id !== resourceId)
      : [...currentResources, resourceId];
    updateCOLearningResources(courseOutcomeId, updatedResources);
  };

  // Handle adding a new teaching method
  const handleAddTeachingMethod = () => {
    if (newTeachingMethod.trim()) {
      addTeachingMethod(newTeachingMethod.trim());
      setNewTeachingMethod("");
    }
  };

  // Handle adding a new learning resource
  const handleAddLearningResource = () => {
    if (newLearningResource.trim()) {
      addLearningResource(newLearningResource.trim());
      setNewLearningResource("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions and Legend */}
      <TMLRInstructions
        teachingMethodsCount={teachingMethods.length}
        learningResourcesCount={learningResources.length}
      />

      {/* Tabs for Course Outcomes */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-4">
          {courseOutcomes.map((co) => {
            const hasMethods = hasAtLeastOneTeachingMethod(co.id);
            const hasResources = hasAtLeastOneLearningResource(co.id);
            const isValid = hasMethods && hasResources;

            return (
              <TabsTrigger
                key={co.id}
                value={co.id.toString()}
                className="relative"
              >
                CO{co.id}
                {isValid ? (
                  <CheckCircle2 className="h-3 w-3 text-green-500 absolute -top-1 -right-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {courseOutcomes.map((co) => (
          <CourseOutcomeTab
            key={co.id}
            courseOutcome={co}
            teachingMethods={teachingMethods}
            learningResources={learningResources}
            selectedMethods={getCOTeachingMethods(co.id)}
            selectedResources={getCOLearningResources(co.id)}
            toggleTeachingMethod={toggleTeachingMethod}
            toggleLearningResource={toggleLearningResource}
            newTeachingMethod={newTeachingMethod}
            setNewTeachingMethod={setNewTeachingMethod}
            handleAddTeachingMethod={handleAddTeachingMethod}
            newLearningResource={newLearningResource}
            setNewLearningResource={setNewLearningResource}
            handleAddLearningResource={handleAddLearningResource}
          />
        ))}
      </Tabs>

      {/* Summary Table */}
      <SummaryTable
        courseOutcomes={courseOutcomes}
        teachingMethods={teachingMethods}
        learningResources={learningResources}
        getCOTeachingMethods={getCOTeachingMethods}
        getCOLearningResources={getCOLearningResources}
        hasAtLeastOneTeachingMethod={hasAtLeastOneTeachingMethod}
        hasAtLeastOneLearningResource={hasAtLeastOneLearningResource}
      />
    </div>
  );
}
