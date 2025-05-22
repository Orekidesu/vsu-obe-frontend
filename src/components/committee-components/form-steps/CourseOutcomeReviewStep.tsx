import { useState } from "react";
import type {
  CourseOutcome,
  CO_ABCD_Mapping,
  CO_CPA_Mapping,
  CO_PO_Mapping,
  AssessmentTask,
  ProgramOutcome,
  TeachingMethod,
  LearningResource,
} from "@/store/course/course-store";

import { CourseOutcomesSection } from "./course-review-components/CourseOutcomeSection";
import { ABCDMappingSection } from "./course-review-components/ABCDMappingSection";
import { CPAClassificationSection } from "./course-review-components/CPAClassificationSection";
import { POMappingSection } from "./course-review-components/POMappingSection";
import { AssessmentTasksSection } from "./course-review-components/AssessmentTaskSection";
import { TeachingLearningSection } from "./course-review-components/TeachingLearningSection";
import { FinalConfirmation } from "./course-review-components/FinalConfirmation";

interface CourseOutcomesReviewStepProps {
  courseOutcomes: CourseOutcome[];
  programOutcomes: ProgramOutcome[];
  abcdMappings: CO_ABCD_Mapping[];
  cpaMappings: CO_CPA_Mapping[];
  poMappings: CO_PO_Mapping[];
  assessmentTasks: AssessmentTask[];
  teachingMethods: TeachingMethod[];
  learningResources: LearningResource[];
  getCOTeachingMethods: (courseOutcomeId: number) => string[];
  getCOLearningResources: (courseOutcomeId: number) => string[];

  isConfirmed: boolean;
  setIsConfirmed: (value: boolean) => void;

  onEditStep: (step: number) => void;
}

export function CourseOutcomesReviewStep({
  courseOutcomes,
  programOutcomes,
  abcdMappings,
  cpaMappings,
  poMappings,
  assessmentTasks,
  teachingMethods,
  learningResources,
  getCOTeachingMethods,
  getCOLearningResources,
  onEditStep,

  isConfirmed,
  setIsConfirmed,
}: CourseOutcomesReviewStepProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    courseOutcomes: false,
    abcdMapping: false,
    cpaClassification: false,
    poMapping: false,
    tlaPlanning: false,
    tlPlanning: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Helper function to get teaching method name by ID
  const getTeachingMethodName = (id: string) => {
    const method = teachingMethods.find((m) => m.id === id);
    return method ? method.name : "Unknown Method";
  };

  // Helper function to get learning resource name by ID
  const getLearningResourceName = (id: string) => {
    const resource = learningResources.find((r) => r.id === id);
    return resource ? resource.name : "Unknown Resource";
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Review Course Details</h2>
        <p className="text-muted-foreground">
          Please review all the information you have provided. You can edit any
          section by clicking the Edit button.
        </p>
      </div>

      {/* Course Outcomes Section */}
      <CourseOutcomesSection
        courseOutcomes={courseOutcomes}
        isExpanded={expandedSections.courseOutcomes}
        toggleSection={() => toggleSection("courseOutcomes")}
        onEditStep={() => onEditStep(1)}
      />

      {/* ABCD Mapping Section */}
      <ABCDMappingSection
        courseOutcomes={courseOutcomes}
        abcdMappings={abcdMappings}
        isExpanded={expandedSections.abcdMapping}
        toggleSection={() => toggleSection("abcdMapping")}
        onEditStep={() => onEditStep(2)}
      />

      {/* CPA Classification Section */}
      <CPAClassificationSection
        courseOutcomes={courseOutcomes}
        cpaMappings={cpaMappings}
        isExpanded={expandedSections.cpaClassification}
        toggleSection={() => toggleSection("cpaClassification")}
        onEditStep={() => onEditStep(3)}
      />

      {/* PO Mapping Section */}
      <POMappingSection
        courseOutcomes={courseOutcomes}
        programOutcomes={programOutcomes}
        poMappings={poMappings}
        isExpanded={expandedSections.poMapping}
        toggleSection={() => toggleSection("poMapping")}
        onEditStep={() => onEditStep(4)}
      />

      {/* Assessment Tasks Section */}
      <AssessmentTasksSection
        courseOutcomes={courseOutcomes}
        assessmentTasks={assessmentTasks}
        isExpanded={expandedSections.tlaPlanning}
        toggleSection={() => toggleSection("tlaPlanning")}
        onEditStep={() => onEditStep(5)}
      />

      {/* Teaching Methods and Learning Resources Section */}
      <TeachingLearningSection
        courseOutcomes={courseOutcomes}
        teachingMethods={teachingMethods}
        learningResources={learningResources}
        getCOTeachingMethods={getCOTeachingMethods}
        getCOLearningResources={getCOLearningResources}
        getTeachingMethodName={getTeachingMethodName}
        getLearningResourceName={getLearningResourceName}
        isExpanded={expandedSections.tlPlanning}
        toggleSection={() => toggleSection("tlPlanning")}
        onEditStep={() => onEditStep(6)}
      />

      {/* Final Confirmation */}
      <FinalConfirmation
        isConfirmed={isConfirmed}
        setIsConfirmed={setIsConfirmed}
      />
    </div>
  );
}
