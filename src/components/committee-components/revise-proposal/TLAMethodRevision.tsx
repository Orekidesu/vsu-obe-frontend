"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertTriangle, RotateCcw } from "lucide-react";
import { useCourseRevisionStore } from "@/store/revision/course-revision-store";
import { Badge } from "@/components/ui/badge";

// Import modular components
import { TLAMethodInstructions } from "./tla-method-components/TLAMethodInstructions";
import { TLAMethodTabContent } from "./tla-method-components/TLAMethodTabContent";
import { TLAMethodSummaryTable } from "./tla-method-components/TLAMethodSummaryTable";

// Default teaching methods and learning resources
const defaultTeachingMethods = [
  "Lecture",
  "Demonstration",
  "Problem-Based Learning",
  "Role Play",
  "Project",
  "Field Trip",
  "Peer Teaching",
  "Discussion",
  "Group Work",
  "Case Study",
  "Simulation",
  "Laboratory",
  "Flipped Classroom",
  "Experiments",
];

const defaultLearningResources = [
  "Textbooks",
  "Lecture Notes",
  "Videos",
  "Journal Articles",
  "Websites",
  "Reference Books",
  "PPT Slides",
  "Online Tutorials",
  "Software",
  "Lab Manuals",
];

export function TLAMethodsRevision() {
  const {
    courseOutcomes,
    updateCourseOutcome,
    resetTLAMethods,
    modifiedSections,
    markSectionAsModified,
  } = useCourseRevisionStore();
  const [selectedCOIndex, setSelectedCOIndex] = useState(0);
  const [customTeachingMethods, setCustomTeachingMethods] = useState<string[]>(
    []
  );
  const [customLearningResources, setCustomLearningResources] = useState<
    string[]
  >([]);
  const [newTeachingMethod, setNewTeachingMethod] = useState("");
  const [newLearningResource, setNewLearningResource] = useState("");

  // Check if TLA methods have been modified
  const isModified = modifiedSections.has("tla_methods");

  // Helper functions
  const getAllTeachingMethods = () => {
    return [...defaultTeachingMethods, ...customTeachingMethods];
  };

  const getAllLearningResources = () => {
    return [...defaultLearningResources, ...customLearningResources];
  };

  // Calculate total counts across all course outcomes
  const calculateTotalCounts = () => {
    const allTeachingMethods = new Set<string>();
    const allLearningResources = new Set<string>();

    courseOutcomes.forEach((outcome) => {
      if (outcome.tla_assessment_method) {
        outcome.tla_assessment_method.teaching_methods?.forEach((method) =>
          allTeachingMethods.add(method)
        );
        outcome.tla_assessment_method.learning_resources?.forEach((resource) =>
          allLearningResources.add(resource)
        );
      }
    });

    return {
      teachingMethods: allTeachingMethods.size,
      learningResources: allLearningResources.size,
    };
  };

  // Update teaching methods for the selected course outcome
  const handleTeachingMethodChange = (method: string, checked: boolean) => {
    const selectedOutcome = courseOutcomes[selectedCOIndex];
    if (!selectedOutcome) return;

    const currentMethods =
      selectedOutcome.tla_assessment_method?.teaching_methods || [];
    const updatedMethods = checked
      ? [...currentMethods, method]
      : currentMethods.filter((m) => m !== method);

    updateCourseOutcome(selectedOutcome.id, {
      tla_assessment_method: {
        ...selectedOutcome.tla_assessment_method,
        teaching_methods: updatedMethods,
        learning_resources:
          selectedOutcome.tla_assessment_method?.learning_resources || [],
      },
    });

    markSectionAsModified("tla_methods");
  };

  // Update learning resources for the selected course outcome
  const handleLearningResourceChange = (resource: string, checked: boolean) => {
    const selectedOutcome = courseOutcomes[selectedCOIndex];
    if (!selectedOutcome) return;

    const currentResources =
      selectedOutcome.tla_assessment_method?.learning_resources || [];
    const updatedResources = checked
      ? [...currentResources, resource]
      : currentResources.filter((r) => r !== resource);

    updateCourseOutcome(selectedOutcome.id, {
      tla_assessment_method: {
        ...selectedOutcome.tla_assessment_method,
        teaching_methods:
          selectedOutcome.tla_assessment_method?.teaching_methods || [],
        learning_resources: updatedResources,
      },
    });

    markSectionAsModified("tla_methods");
  };

  // Add custom teaching method
  const handleAddTeachingMethod = () => {
    const method = newTeachingMethod.trim();
    if (method && !getAllTeachingMethods().includes(method)) {
      setCustomTeachingMethods((prev) => [...prev, method]);
      handleTeachingMethodChange(method, true);
    }
    setNewTeachingMethod("");
  };

  // Add custom learning resource
  const handleAddLearningResource = () => {
    const resource = newLearningResource.trim();
    if (resource && !getAllLearningResources().includes(resource)) {
      setCustomLearningResources((prev) => [...prev, resource]);
      handleLearningResourceChange(resource, true);
    }
    setNewLearningResource("");
  };

  // Reset to original state
  const handleReset = () => {
    resetTLAMethods();
    setCustomTeachingMethods([]);
    setCustomLearningResources([]);
  };

  const totalCounts = calculateTotalCounts();

  return (
    <div className="space-y-6">
      {/* Header with modification status */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Teaching Methods & Learning Resources
        </h2>
        {isModified && (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Modified
          </Badge>
        )}
        {isModified && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              className="text-gray-600"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Original
            </Button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <TLAMethodInstructions
        teachingMethodsCount={totalCounts.teachingMethods}
        learningResourcesCount={totalCounts.learningResources}
      />

      {/* Tabs for Course Outcomes */}
      <Tabs
        value={selectedCOIndex.toString()}
        onValueChange={(value) => setSelectedCOIndex(Number.parseInt(value))}
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-4">
          {courseOutcomes.map((outcome, index) => {
            const hasMethods =
              (outcome.tla_assessment_method?.teaching_methods?.length || 0) >
              0;
            const hasResources =
              (outcome.tla_assessment_method?.learning_resources?.length || 0) >
              0;
            const isValid = hasMethods && hasResources;

            return (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className="relative"
              >
                CO{index + 1}
                {isValid ? (
                  <CheckCircle className="h-3 w-3 text-green-500 absolute -top-1 -right-1" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {courseOutcomes.map((outcome, coIndex) => (
          <TLAMethodTabContent
            key={coIndex}
            outcome={outcome}
            coIndex={coIndex}
            allTeachingMethods={getAllTeachingMethods()}
            allLearningResources={getAllLearningResources()}
            handleTeachingMethodChange={handleTeachingMethodChange}
            handleLearningResourceChange={handleLearningResourceChange}
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
      <TLAMethodSummaryTable courseOutcomes={courseOutcomes} />

      {/* Reset Button - only show when modified */}
    </div>
  );
}
