import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Check,
  AlertCircle,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
}: CourseOutcomesReviewStepProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    courseOutcomes: true,
    abcdMapping: true,
    cpaClassification: true,
    poMapping: true,
    tlaPlanning: true,
    tlPlanning: true,
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

  // Helper function to get domain name
  const getDomainName = (domain: string | null) => {
    if (!domain) return "Not classified";

    const domains = {
      cognitive: "Cognitive",
      psychomotor: "Psychomotor",
      affective: "Affective",
    };

    return domains[domain as keyof typeof domains] || "Unknown";
  };

  // Helper function to get contribution level name
  const getContributionLevelName = (level: string) => {
    const levels = {
      I: "Introductory",
      E: "Enabling",
      D: "Demonstrative",
    };

    return levels[level as keyof typeof levels] || level;
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
      <Card className="border border-gray-200">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleSection("courseOutcomes")}
        >
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Course Outcomes</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onEditStep(1);
              }}
            >
              <PenLine className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            {expandedSections.courseOutcomes ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </div>

        {expandedSections.courseOutcomes && (
          <CardContent className="pt-0">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Statement
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {courseOutcomes.map((outcome) => (
                    <tr key={outcome.id}>
                      <td className="px-4 py-3 text-sm">{outcome.name}</td>
                      <td className="px-4 py-3 text-sm">{outcome.name}</td>
                      <td className="px-4 py-3 text-sm">{outcome.statement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ABCD Mapping Section */}
      <Card className="border border-gray-200">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleSection("abcdMapping")}
        >
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">ABCD Mapping</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onEditStep(2);
              }}
            >
              <PenLine className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            {expandedSections.abcdMapping ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </div>

        {expandedSections.abcdMapping && (
          <CardContent className="pt-0">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      CO
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Audience
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Behavior
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Condition
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Degree
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {courseOutcomes.map((outcome) => {
                    const mapping = abcdMappings.find(
                      (m) => m.co_id === outcome.id
                    );
                    return (
                      <tr key={outcome.id}>
                        <td className="px-4 py-3 text-sm">{outcome.name}</td>
                        <td className="px-4 py-3 text-sm">
                          {mapping?.audience || "Not specified"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {mapping?.behavior || "Not specified"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {mapping?.condition || "Not specified"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {mapping?.degree || "Not specified"}
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

      {/* CPA Classification Section */}
      <Card className="border border-gray-200">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleSection("cpaClassification")}
        >
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">CPA Classification</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onEditStep(3);
              }}
            >
              <PenLine className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            {expandedSections.cpaClassification ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </div>

        {expandedSections.cpaClassification && (
          <CardContent className="pt-0">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      CO
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Domain
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {courseOutcomes.map((outcome) => {
                    const mapping = cpaMappings.find(
                      (m) => m.courseOutcomeId === outcome.id
                    );
                    return (
                      <tr key={outcome.id}>
                        <td className="px-4 py-3 text-sm">{outcome.name}</td>
                        <td className="px-4 py-3 text-sm">
                          {getDomainName(mapping?.domain || null)}
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

      {/* PO Mapping Section */}
      <Card className="border border-gray-200">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleSection("poMapping")}
        >
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">PO Mapping</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onEditStep(4);
              }}
            >
              <PenLine className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            {expandedSections.poMapping ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </div>

        {expandedSections.poMapping && (
          <CardContent className="pt-0">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      CO
                    </th>
                    {programOutcomes.map((po) => (
                      <th
                        key={po.id}
                        className="px-4 py-2 text-center text-sm font-medium text-gray-500"
                      >
                        {po.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {courseOutcomes.map((outcome) => (
                    <tr key={outcome.id}>
                      <td className="px-4 py-3 text-sm">{outcome.name}</td>
                      {programOutcomes.map((po) => {
                        const mapping = poMappings.find(
                          (m) =>
                            m.courseOutcomeId === outcome.id &&
                            m.programOutcomeId === po.id
                        );
                        return (
                          <td
                            key={po.id}
                            className="px-4 py-3 text-sm text-center"
                          >
                            {mapping
                              ? getContributionLevelName(
                                  mapping.contributionLevel
                                )
                              : "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* TLA Planning Section */}
      <Card className="border border-gray-200">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleSection("tlaPlanning")}
        >
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Assessment Tasks</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onEditStep(5);
              }}
            >
              <PenLine className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            {expandedSections.tlaPlanning ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </div>

        {expandedSections.tlaPlanning && (
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
                          <td className="px-4 py-3 text-sm">
                            No tasks defined
                          </td>
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

      {/* Teaching Methods and Learning Resources Section */}
      <Card className="border border-gray-200">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleSection("tlPlanning")}
        >
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">
              Teaching Methods & Learning Resources
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onEditStep(6);
              }}
            >
              <PenLine className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            {expandedSections.tlPlanning ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </div>

        {expandedSections.tlPlanning && (
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

      {/* Final Confirmation */}
      <Card className="border border-gray-200">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold">Final Confirmation</h3>
          </div>
          <p className="mt-2 text-muted-foreground pl-7">
            Please ensure all information is correct before submitting. Once
            submitted, your course details will be saved and can be accessed
            from the My Courses page.
          </p>
        </div>
      </Card>
    </div>
  );
}
