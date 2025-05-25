"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, RotateCcw, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useCourseRevisionStore,
  type CourseOutcome,
} from "@/store/revision/course-revision-store";
import { sampleProgramOutcomes } from "@/store/revision/sample-data/courseData";

export function COPOMappingRevision() {
  const {
    courseOutcomes,
    updateCourseOutcome,
    modifiedSections,
    resetCOPOMappings,
    markSectionAsModified,
  } = useCourseRevisionStore();

  const [activeTab, setActiveTab] = useState(0);

  const isModified = modifiedSections.has("po_mappings");

  // Calculate completion statistics
  const completedOutcomes = courseOutcomes.filter((outcome) =>
    outcome.po_mappings.some((mapping) => mapping.ied && mapping.ied !== "")
  ).length;

  const totalOutcomes = courseOutcomes.length;

  // Handle PO mapping update
  const handlePOMappingUpdate = (
    outcomeId: number | null,
    poId: number,
    iedLevel: string
  ) => {
    const outcome = courseOutcomes.find((co) => co.id === outcomeId);
    if (!outcome) return;

    const updatedMappings = [...outcome.po_mappings];

    // Find existing mapping for this PO
    const existingMappingIndex = updatedMappings.findIndex(
      (mapping) => mapping.po_id === poId
    );

    if (iedLevel === "" || iedLevel === "None") {
      // Remove mapping if "None" is selected
      if (existingMappingIndex !== -1) {
        updatedMappings.splice(existingMappingIndex, 1);
      }
    } else {
      // Add or update mapping
      const poData = sampleProgramOutcomes.find((po) => po.id === poId);
      if (existingMappingIndex !== -1) {
        // Update existing mapping
        updatedMappings[existingMappingIndex] = {
          ...updatedMappings[existingMappingIndex],
          ied: iedLevel,
        };
      } else {
        // Add new mapping
        updatedMappings.push({
          po_id: poId,
          po_name: poData?.name,
          po_statement: poData?.statement,
          ied: iedLevel,
        });
      }
    }

    updateCourseOutcome(outcomeId, { po_mappings: updatedMappings });
    markSectionAsModified("po_mappings");
  };

  // Get current mapping for a specific PO and CO
  const getCurrentMapping = (
    outcomeId: number | null,
    poId: number
  ): string => {
    const outcome = courseOutcomes.find((co) => co.id === outcomeId);
    if (!outcome) return "";

    const mapping = outcome.po_mappings.find(
      (mapping) => mapping.po_id === poId
    );
    return mapping?.ied || "";
  };

  // Check if outcome has any mappings
  const isOutcomeMapped = (outcome: CourseOutcome): boolean => {
    return outcome.po_mappings.some(
      (mapping: { po_id: number; ied: string }) =>
        mapping.ied && mapping.ied !== ""
    );
  };

  if (courseOutcomes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">CO-PO Mapping</h2>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No course outcomes available. Please add course outcomes first
            before setting up CO-PO mappings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentOutcome = courseOutcomes[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">CO-PO Mapping</h2>
          {isModified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Modified
            </Badge>
          )}
        </div>
        {isModified && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Changes
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset CO-PO Mappings</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all CO-PO mappings to their original state.
                  Any changes you&apos;ve made will be lost. This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetCOPOMappings}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Instructions */}
      <Alert className="border-amber-200 bg-amber-50">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="space-y-2">
            <p className="font-medium">CO-PO Mapping Instructions</p>
            <p>
              Map each Course Outcome (CO) to one or more Program Outcomes (POs)
              by selecting a contribution level. Each CO must be mapped to at
              least one PO.
            </p>
            <p>
              <strong>Note:</strong> Not all contribution levels are available
              for every Program Outcome. Unavailable options will be disabled.
            </p>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 border-yellow-300"
                >
                  I
                </Badge>
                <span className="text-sm">Introductory</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-300"
                >
                  E
                </Badge>
                <span className="text-sm">Enabling</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge
                  variant="outline"
                  className="bg-purple-100 text-purple-800 border-purple-300"
                >
                  D
                </Badge>
                <span className="text-sm">Development</span>
              </div>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span>
          Progress: {completedOutcomes} of {totalOutcomes} completed
        </span>
        <div className="flex items-center gap-2 text-amber-600">
          <Info className="w-4 h-4" />
          <span>Complete all mappings to proceed</span>
        </div>
      </div>

      {/* Course Outcome Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg overflow-x-auto">
        {courseOutcomes.map((outcome, index) => (
          <button
            key={outcome.id || index}
            onClick={() => setActiveTab(index)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
              activeTab === index
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span>CO {index + 1}</span>
            {isOutcomeMapped(outcome) && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </button>
        ))}
      </div>

      {/* Current Course Outcome */}
      {currentOutcome && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Course Outcome {activeTab + 1}
              </CardTitle>
              <Badge
                variant={
                  isOutcomeMapped(currentOutcome) ? "default" : "destructive"
                }
              >
                {isOutcomeMapped(currentOutcome) ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Mapped
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Not mapped
                  </>
                )}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{currentOutcome.statement}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-medium">Map to Program Outcomes</h4>

              {/* PO Mapping Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        PO #
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        PO Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Statement
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                        Contribution Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sampleProgramOutcomes.map((po) => {
                      const currentMapping = getCurrentMapping(
                        currentOutcome.id,
                        po.id
                      );
                      return (
                        <tr key={po.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">
                            {po.name}
                          </td>
                          <td className="px-4 py-3 text-sm">{po.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {po.statement}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              {["I", "E", "D", "None"].map((level) => (
                                <label
                                  key={level}
                                  className="flex items-center gap-1 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name={`po-${po.id}`}
                                    value={level}
                                    checked={
                                      level === "None"
                                        ? currentMapping === ""
                                        : currentMapping === level
                                    }
                                    onChange={(e) =>
                                      handlePOMappingUpdate(
                                        currentOutcome.id,
                                        po.id,
                                        e.target.value === "None"
                                          ? ""
                                          : e.target.value
                                      )
                                    }
                                    className="text-blue-600"
                                  />
                                  <span
                                    className={`text-sm ${
                                      level === "I"
                                        ? "text-yellow-700"
                                        : level === "E"
                                          ? "text-green-700"
                                          : level === "D"
                                            ? "text-purple-700"
                                            : "text-gray-700"
                                    }`}
                                  >
                                    {level}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CO-PO Mapping Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">CO-PO Mapping Summary</CardTitle>
          <p className="text-sm text-gray-600">
            Overview of all Course Outcomes mapped to Program Outcomes
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    CO Name
                  </th>
                  {sampleProgramOutcomes.map((po) => (
                    <th
                      key={po.id}
                      className="px-4 py-3 text-center text-sm font-medium text-gray-900"
                    >
                      {po.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courseOutcomes.map((outcome, index) => (
                  <tr key={outcome.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {outcome.name}
                    </td>
                    {sampleProgramOutcomes.map((po) => {
                      const mapping = getCurrentMapping(outcome.id, po.id);
                      return (
                        <td key={po.id} className="px-4 py-3 text-center">
                          {mapping ? (
                            <Badge
                              variant="outline"
                              className={
                                mapping === "I"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : mapping === "E"
                                    ? "bg-green-100 text-green-800 border-green-300"
                                    : "bg-purple-100 text-purple-800 border-purple-300"
                              }
                            >
                              {mapping}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
