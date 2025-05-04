import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type {
  CourseOutcome,
  AssessmentTask,
} from "@/store/course/course-store";

import { TLAInstructions } from "./course-tla-components/TLAInstructions";
import { CourseOutcomeTab } from "./course-tla-components/TLATabContent";
import { TLASummaryTable } from "./course-tla-components/TLASummaryTable";

interface CourseOutcomesTLAStepProps {
  courseOutcomes: CourseOutcome[];
  assessmentTasks: AssessmentTask[];
  onAddAssessmentTask: (courseOutcomeId: number) => void;
  onUpdateAssessmentTask: (
    id: string,
    courseOutcomeId: number,
    code: string,
    name: string,
    tool: string,
    weight: number
  ) => void;
  onRemoveAssessmentTask: (id: string) => void;
  getTotalAssessmentWeight: () => number;
}

export function CourseOutcomesTLAStep({
  courseOutcomes,
  assessmentTasks,
  onAddAssessmentTask,
  onUpdateAssessmentTask,
  onRemoveAssessmentTask,
  getTotalAssessmentWeight,
}: CourseOutcomesTLAStepProps) {
  const [activeTab, setActiveTab] = useState<string>(
    courseOutcomes[0]?.id.toString() || "1"
  );
  const [customTools, setCustomTools] = useState<string[]>([]);

  // Default assessment tools
  const defaultTools = ["Marking Scheme", "Rubric", "Project"];

  // Combine default and custom tools
  const assessmentTools = [
    ...defaultTools,
    ...customTools.filter((tool) => !defaultTools.includes(tool)),
  ];

  // Helper function to handle adding custom tools
  const handleAddCustomTool = (value: string) => {
    if (value && !assessmentTools.includes(value)) {
      setCustomTools([...customTools, value]);
      return value;
    }
    return value;
  };

  // Helper function to get assessment tasks for a specific CO
  const getAssessmentTasksForCO = (
    courseOutcomeId: number
  ): AssessmentTask[] => {
    return assessmentTasks.filter(
      (task) => task.courseOutcomeId === courseOutcomeId
    );
  };

  // Check if a CO has at least one assessment task
  const hasAtLeastOneAssessmentTask = (courseOutcomeId: number): boolean => {
    return assessmentTasks.some(
      (task) => task.courseOutcomeId === courseOutcomeId
    );
  };

  // Get the total weight for a specific CO
  const getTotalWeightForCO = (courseOutcomeId: number): number => {
    return getAssessmentTasksForCO(courseOutcomeId).reduce(
      (total, task) => total + task.weight,
      0
    );
  };

  // Get the total weight across all COs
  const totalWeight = getTotalAssessmentWeight();

  // Check if the total weight is exactly 100%
  const isTotalWeightValid = Math.abs(totalWeight - 100) < 0.01; // Allow for small floating point errors

  return (
    <div className="space-y-6">
      {/* Instructions and Legend */}
      <TLAInstructions
        totalWeight={totalWeight}
        isTotalWeightValid={isTotalWeightValid}
      />

      {/* Tabs for Course Outcomes */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-4">
          {courseOutcomes.map((co) => (
            <TabsTrigger
              key={co.id}
              value={co.id.toString()}
              className="relative"
            >
              CO{co.id}
              {hasAtLeastOneAssessmentTask(co.id) ? (
                <CheckCircle2 className="h-3 w-3 text-green-500 absolute -top-1 -right-1" />
              ) : (
                <AlertCircle className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {courseOutcomes.map((co) => (
          <CourseOutcomeTab
            key={co.id}
            courseOutcome={co}
            assessmentTasks={getAssessmentTasksForCO(co.id)}
            hasAtLeastOneAssessmentTask={hasAtLeastOneAssessmentTask(co.id)}
            totalWeight={getTotalWeightForCO(co.id)}
            assessmentTools={assessmentTools}
            onAddAssessmentTask={onAddAssessmentTask}
            onUpdateAssessmentTask={onUpdateAssessmentTask}
            onRemoveAssessmentTask={onRemoveAssessmentTask}
            handleAddCustomTool={handleAddCustomTool}
          />
        ))}
      </Tabs>

      {/* Summary Table */}
      <TLASummaryTable
        courseOutcomes={courseOutcomes}
        getAssessmentTasksForCO={getAssessmentTasksForCO}
        getTotalWeightForCO={getTotalWeightForCO}
        totalWeight={totalWeight}
        isTotalWeightValid={isTotalWeightValid}
      />
    </div>
  );
}
