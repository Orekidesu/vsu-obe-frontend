"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, RotateCcw } from "lucide-react";
import { useRevisionStore } from "@/store/revision/revision-store";
import {
  sampleCourses,
  sampleSemesters,
} from "@/store/revision/sample-data/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define contribution levels with colors
const contributionLevels = [
  {
    value: "I",
    label: "Introductory",
    description: "The outcome is introduced",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "E",
    label: "Enabling",
    description: "The outcome is emphasized",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "D",
    label: "Development",
    description: "The outcome is demonstrated",
    color: "bg-purple-100 text-purple-800",
  },
];

export function CoursePOMappingRevision() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [showMappingSummary, setShowMappingSummary] = useState(true);

  const {
    pos,
    curriculum_courses,
    course_po_mappings,
    addCourseToPOMapping,
    updateCourseToPOMapping,
    removeCourseToPOMapping,
    resetSection,
    isModified,
  } = useRevisionStore();

  // Get course details by ID
  const getCourseDetails = (courseId: number) => {
    return sampleCourses.find((course) => course.id === courseId);
  };

  // Get semester details by ID
  const getSemesterDetails = (semesterId: number) => {
    return sampleSemesters.find((semester) => semester.id === semesterId);
  };

  // Get mapping for a course and PO
  const getMapping = (curriculumCourseId: number, poId: number) => {
    return course_po_mappings.find(
      (mapping) =>
        mapping.curriculum_course_id === curriculumCourseId &&
        mapping.po_id === poId
    );
  };

  // Get contribution level for a course and PO
  const getContributionLevel = (curriculumCourseId: number, poId: number) => {
    const mapping = getMapping(curriculumCourseId, poId);
    return mapping ? mapping.ied : null;
  };

  // Get badge color for a contribution level
  const getBadgeColor = (level: string) => {
    const contribution = contributionLevels.find((c) => c.value === level);
    return contribution ? contribution.color : "bg-gray-100 text-gray-800";
  };

  // Handle contribution level change
  const handleContributionChange = (
    curriculumCourseId: number,
    poId: number,
    level: string
  ) => {
    const mapping = getMapping(curriculumCourseId, poId);

    if (mapping) {
      // Check if the level is already in the array
      const levelIndex = mapping.ied.indexOf(level);
      let newLevels: string[];

      if (levelIndex >= 0) {
        // If level exists, remove it
        newLevels = mapping.ied.filter((l) => l !== level);

        // If removing the last level, remove the mapping entirely
        if (newLevels.length === 0) {
          removeCourseToPOMapping(curriculumCourseId, poId);
          return;
        }
      } else {
        // If level doesn't exist, add it to the array
        newLevels = [...mapping.ied, level].sort();
      }

      // Update with new array of levels
      updateCourseToPOMapping(curriculumCourseId, poId, newLevels);
    } else {
      // Add new mapping with single level to start
      addCourseToPOMapping(curriculumCourseId, poId, [level]);
    }
  };

  // Get selected course details
  const selectedCourse = selectedCourseId
    ? curriculum_courses.find((c) => c.id === Number(selectedCourseId))
    : null;

  const selectedCourseDetails = selectedCourse
    ? getCourseDetails(selectedCourse.course_id)
    : null;

  return (
    <div className="space-y-6">
      {/* Contribution Levels Legend */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-2">Contribution Levels</h3>
          <p className="text-gray-600 mb-4">
            Map each course to program outcomes with one or more contribution
            levels
          </p>
          <div className="flex flex-wrap gap-3">
            {contributionLevels.map((level) => (
              <Badge
                key={level.value}
                className={`text-sm py-1 px-3 ${level.color}`}
              >
                <span className="mr-2 font-bold">{level.value}</span>{" "}
                {level.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Selection */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Select a Course to Map</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMappingSummary(!showMappingSummary)}
            >
              {showMappingSummary ? "Hide" : "Show"} Mapping Summary
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetDialogOpen(true)}
              disabled={!isModified("course_po_mappings")}
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Reset Changes
            </Button>
          </div>
        </div>
        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a course to map" />
          </SelectTrigger>
          <SelectContent>
            {curriculum_courses.map((course) => {
              const courseDetails = getCourseDetails(course.course_id);
              const semesterDetails = getSemesterDetails(course.semester_id);

              if (!courseDetails || !semesterDetails) return null;

              return (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {courseDetails.code} - {courseDetails.descriptive_title}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Course Mapping */}
      {selectedCourse && selectedCourseDetails && (
        <div>
          <h3 className="text-lg font-medium mb-4">
            Mapping for: {selectedCourseDetails.code} -{" "}
            {selectedCourseDetails.descriptive_title}
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">PO</TableHead>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Statement</TableHead>
                <TableHead className="w-[200px] text-center">
                  Contribution Levels
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pos.map((po) => {
                const currentLevel = getContributionLevel(
                  selectedCourse.id,
                  po.id
                );

                return (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.name}</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>{po.statement}</TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {currentLevel && currentLevel.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {currentLevel.map((level) => (
                                  <Badge
                                    key={level}
                                    className={`${getBadgeColor(level)}`}
                                  >
                                    {level}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">Select</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Contribution Levels</h4>
                            {contributionLevels.map((level) => (
                              <div
                                key={level.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${po.id}-${level.value}`}
                                  checked={
                                    currentLevel
                                      ? currentLevel.includes(level.value)
                                      : false
                                  }
                                  onCheckedChange={() =>
                                    handleContributionChange(
                                      selectedCourse.id,
                                      po.id,
                                      level.value
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`${po.id}-${level.value}`}
                                  className="text-sm flex items-center cursor-pointer"
                                >
                                  <Badge
                                    className={`mr-2 ${getBadgeColor(level.value)}`}
                                  >
                                    {level.value}
                                  </Badge>
                                  {level.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Mapping Summary */}
      {showMappingSummary && (
        <div>
          <h3 className="text-lg font-medium mb-4">
            Curriculum Mapping Summary
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Course</TableHead>
                  {pos.map((po) => (
                    <TableHead key={po.id} className="text-center">
                      {po.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {curriculum_courses.map((course) => {
                  const courseDetails = getCourseDetails(course.course_id);

                  if (!courseDetails) return null;

                  return (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {courseDetails.code}
                      </TableCell>
                      {pos.map((po) => {
                        const level = getContributionLevel(course.id, po.id);

                        return (
                          <TableCell key={po.id} className="text-center">
                            {level && level.length > 0 ? (
                              <div className="flex justify-center gap-1 flex-wrap">
                                {level.map((l) => (
                                  <Badge
                                    key={l}
                                    className={`${getBadgeColor(l)}`}
                                  >
                                    {l}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Help Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          <span className="font-medium">How to map courses to POs:</span> Select
          a course, then choose the appropriate contribution level for each
          program outcome. Use the matrix view to see the overall mapping across
          the curriculum.
        </AlertDescription>
      </Alert>

      {/* Reset Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all changes made to the
              course-to-PO mappings? This will revert to the original data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetSection("course_po_mappings");
                setIsResetDialogOpen(false);
              }}
            >
              Reset Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
