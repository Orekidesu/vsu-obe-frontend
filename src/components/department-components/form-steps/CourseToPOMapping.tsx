import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CurriculumCourse,
  ProgramOutcome,
  ContributionLevel,
  CourseToPOMapping,
} from "@/store/wizard-store";

interface CourseToPOMappingStepProps {
  curriculumCourses: CurriculumCourse[];
  programOutcomes: ProgramOutcome[];
  courseToPOMappings: CourseToPOMapping[];
  updateCourseToPOMapping: (
    courseId: number,
    poId: number,
    contributionLevels: ContributionLevel[]
  ) => void;
}

export function CourseToPOMappingStep({
  curriculumCourses,
  programOutcomes,
  courseToPOMappings,
  updateCourseToPOMapping,
}: CourseToPOMappingStepProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  // Get contribution levels for a specific course and PO
  const getContributionLevels = (
    courseId: number,
    poId: number
  ): ContributionLevel[] => {
    const mapping = courseToPOMappings.find(
      (m) => m.courseId === courseId && m.poId === poId
    );
    return mapping ? mapping.contributionLevels : [];
  };

  // Toggle a contribution level for a specific course and PO
  const toggleContributionLevel = (
    courseId: number,
    poId: number,
    level: ContributionLevel
  ) => {
    const currentLevels = getContributionLevels(courseId, poId);
    let newLevels: ContributionLevel[];

    if (currentLevels.includes(level)) {
      // Remove the level if it already exists
      newLevels = currentLevels.filter((l) => l !== level);
    } else {
      // Add the level if it doesn't exist
      newLevels = [...currentLevels, level];
    }

    // Update the mapping
    updateCourseToPOMapping(courseId, poId, newLevels);
  };

  // Get the color for a contribution level badge
  const getLevelBadgeColor = (level: ContributionLevel) => {
    switch (level) {
      case "I":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "E":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "D":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Get the full name for a contribution level
  const getLevelFullName = (level: ContributionLevel) => {
    switch (level) {
      case "I":
        return "Introductory";
      case "E":
        return "Enabling";
      case "D":
        return "Development";
      default:
        return level;
    }
  };

  // Truncate long text for display
  const truncateText = (text: string, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Map Courses to Program Outcomes
      </h2>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Contribution Levels</CardTitle>
            <CardDescription>
              Map each course to program outcomes with one or more contribution
              levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">I</Badge>
                <span>Introductory</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">E</Badge>
                <span>Enabling</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">D</Badge>
                <span>Development</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Select a Course to Map</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-sm text-muted-foreground cursor-help">
                    <Info className="mr-1 h-4 w-4" />
                    <span>How to map courses to POs</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-md">
                  <p>
                    Select a course, then use the checkboxes to assign
                    contribution levels (I, E, D) to each Program Outcome. A
                    course can have multiple contribution levels for each PO.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Select a course to map" />
            </SelectTrigger>
            <SelectContent>
              {curriculumCourses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.code} - {course.descriptive_title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mapping Table */}
        {selectedCourse && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Mapping for:{" "}
              {
                curriculumCourses.find(
                  (c) => c.id.toString() === selectedCourse
                )?.code
              }{" "}
              -{" "}
              {
                curriculumCourses.find(
                  (c) => c.id.toString() === selectedCourse
                )?.descriptive_title
              }
            </h3>

            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] border">PO</TableHead>
                  <TableHead className="w-[150px] border">Name</TableHead>
                  <TableHead className="border">Statement</TableHead>
                  <TableHead className="w-[200px] border text-center">
                    Contribution Levels
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programOutcomes.map((po) => {
                  const contributionLevels = getContributionLevels(
                    parseInt(selectedCourse, 10),
                    po.id
                  );

                  return (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium border">
                        PO{po.id}
                      </TableCell>
                      <TableCell className="border">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{truncateText(po.name)}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{po.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="border">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{truncateText(po.statement)}</span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-md">
                              <p>{po.statement}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="border">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {contributionLevels.length > 0 ? (
                                <div className="flex gap-1">
                                  {contributionLevels.map((level) => (
                                    <Badge
                                      key={level}
                                      className={getLevelBadgeColor(level)}
                                    >
                                      {level}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">
                                  Select levels
                                </span>
                              )}
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-4">
                            <div className="space-y-4">
                              <h4 className="font-medium">
                                Contribution Levels
                              </h4>
                              <div className="space-y-2">
                                {(["I", "E", "D"] as ContributionLevel[]).map(
                                  (level) => (
                                    <div
                                      key={level}
                                      className="flex items-center space-x-2"
                                    >
                                      <Checkbox
                                        id={`level-${po.id}-${level}`}
                                        checked={contributionLevels.includes(
                                          level
                                        )}
                                        onCheckedChange={() =>
                                          toggleContributionLevel(
                                            parseInt(selectedCourse, 10),
                                            po.id,
                                            level
                                          )
                                        }
                                      />
                                      <Label
                                        htmlFor={`level-${po.id}-${level}`}
                                        className="flex items-center gap-2"
                                      >
                                        <Badge
                                          className={getLevelBadgeColor(level)}
                                        >
                                          {level}
                                        </Badge>
                                        <span>{getLevelFullName(level)}</span>
                                      </Label>
                                    </div>
                                  )
                                )}
                              </div>
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

        {/* Summary Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Curriculum Mapping Summary</h3>

          {courseToPOMappings.length === 0 ? (
            <div className="text-center p-6 border rounded-md bg-muted/20">
              <p>
                No mappings created yet. Select a course and map it to program
                outcomes.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableHead className="border">Course</TableHead>
                    {programOutcomes.map((po) => (
                      <TableHead key={po.id} className="border text-center">
                        PO{po.id}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {curriculumCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="border font-medium">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{course.code}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{course.descriptive_title}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      {programOutcomes.map((po) => {
                        const levels = getContributionLevels(course.id, po.id);
                        return (
                          <TableCell key={po.id} className="border text-center">
                            {levels.length > 0 ? (
                              <div className="flex justify-center gap-1">
                                {levels.map((level) => (
                                  <Badge
                                    key={level}
                                    className={getLevelBadgeColor(level)}
                                  >
                                    {level}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
