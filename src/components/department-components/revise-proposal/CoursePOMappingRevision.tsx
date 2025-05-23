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
import { Info, RotateCcw, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRevisionStore } from "@/store/revision/revision-store";
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

import useCourses from "@/hooks/department/useCourse";
import useSemesters from "@/hooks/department/useSemester";

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

  // fetch courses
  const {
    courses,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useCourses();

  // fetch semesters
  const {
    semesters,
    isLoading: isLoadingSemesters,
    error: semestersError,
  } = useSemesters();

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
    return (
      courses?.find((course) => course.id === courseId) || {
        id: courseId,
        code:
          curriculum_courses.find((c) => c.course_id === courseId)
            ?.course_code || "Unknown",
        descriptive_title:
          curriculum_courses.find((c) => c.course_id === courseId)
            ?.course_title || "Unknown Course",
      }
    );
  };
  //  helper function for truncating text
  const truncateText = (text: string, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Get semester details by ID
  const getSemesterDetails = (semesterId: number) => {
    const semester = semesters?.find((semester) => semester.id === semesterId);
    if (!semester) return null;

    // No need to modify, just return the semester
    return semester;
  };

  // Format semester display text (since API doesn't provide a display property)
  // const formatSemesterDisplay = (semester: { year: number; sem?: string }) => {
  //   if (!semester) return "";

  //   // Safely handle undefined sem
  //   const sem = semester.sem || "";
  //   let semesterLabel = "";

  //   // Handle all three possible values
  //   switch (sem.toLowerCase()) {
  //     case "first":
  //       semesterLabel = "First";
  //       break;
  //     case "second":
  //       semesterLabel = "Second";
  //       break;
  //     case "midyear":
  //       semesterLabel = "Midyear";
  //       break;
  //     default:
  //       semesterLabel = sem.charAt(0).toUpperCase() + sem.slice(1);
  //   }

  //   return `Year ${semester.year} - ${semesterLabel}`;
  // };

  // Get mapping for a course and PO
  const getMapping = (
    curriculumCourseId: number | string,
    poId: number | string
  ) => {
    return course_po_mappings.find(
      (mapping) =>
        mapping.curriculum_course_id === curriculumCourseId &&
        mapping.po_id === poId
    );
  };

  // Get contribution level for a course and PO
  const getContributionLevel = (
    curriculumCourseId: number | string,
    poId: number | string
  ) => {
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
    curriculumCourseId: number | string,
    poId: number | string,
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
    ? curriculum_courses.find((c) => String(c.id) === selectedCourseId)
    : null;

  const selectedCourseDetails = selectedCourse
    ? getCourseDetails(selectedCourse.course_id)
    : null;

  // Show loading state if courses are being fetched
  if (isLoadingCourses || isLoadingSemesters) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-sm text-gray-500">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Show error state if there was an error fetching courses
  if (coursesError || semestersError) {
    return (
      <Alert className="bg-red-50 border-red-200 mb-4">
        <AlertDescription className="text-red-700">
          Error loading courses. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <TooltipProvider>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsResetDialogOpen(true)}
                    disabled={!isModified("course_po_mappings")}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" /> Reset Changes
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset all mapping changes to original state</p>
                </TooltipContent>
              </Tooltip>
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
                {pos.map((po, index) => {
                  const currentLevel = getContributionLevel(
                    selectedCourse.id,
                    po.id
                  );

                  return (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">
                        <span className="cursor-help">{index + 1}</span>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              {truncateText(po.name, 25)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{po.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              {truncateText(po.statement, 60)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <p>{po.statement}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
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
                              <h4 className="font-medium">
                                Contribution Levels
                              </h4>
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
                                  <Tooltip>
                                    <TooltipTrigger asChild>
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
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{level.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">{po.name}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{po.name}</p>
                            <p className="text-xs mt-1">
                              {truncateText(po.statement, 60)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                {courseDetails.code}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{courseDetails.descriptive_title}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        {pos.map((po) => {
                          const level = getContributionLevel(course.id, po.id);

                          return (
                            <TableCell key={po.id} className="text-center">
                              {level && level.length > 0 ? (
                                <div className="flex justify-center gap-1 flex-wrap">
                                  {level.map((l) => (
                                    <Tooltip key={l}>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          className={`${getBadgeColor(l)} cursor-help`}
                                        >
                                          {l}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {
                                            contributionLevels.find(
                                              (cl) => cl.value === l
                                            )?.label
                                          }
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
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
            <span className="font-medium">How to map courses to POs:</span>{" "}
            Select a course, then choose the appropriate contribution level for
            each program outcome. Use the matrix view to see the overall mapping
            across the curriculum.
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
    </TooltipProvider>
  );
}
