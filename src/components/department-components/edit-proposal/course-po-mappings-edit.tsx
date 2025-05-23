import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Course {
  code: string;
  descriptive_title: string;
}

interface PO {
  name: string;
  statement: string;
}

interface Semester {
  year: number;
  sem: string;
}

interface CurriculumCourse {
  course_code: string;
  category_code: string;
  semester_year: number;
  semester_name: string;
  units: number;
}

interface CoursePOMapping {
  course_code: string;
  po_code: string;
  ied: string[];
}

interface CoursePOMappingEditProps {
  courses: Course[];
  pos: PO[];
  semesters: Semester[];
  curriculumCourses: CurriculumCourse[];
  coursePOMappings: CoursePOMapping[];
  updateCoursePOMappings: (mappings: CoursePOMapping[]) => void;
  getSemesterName: (semesterCode: string) => string;
}

export function CoursePOMappingEdit({
  courses,
  pos,
  semesters,
  curriculumCourses,
  coursePOMappings,
  updateCoursePOMappings,
  getSemesterName,
}: CoursePOMappingEditProps) {
  const [localMappings, setLocalMappings] =
    useState<CoursePOMapping[]>(coursePOMappings);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [expandedSemesters, setExpandedSemesters] = useState<string[]>(
    semesters.map((sem) => `${sem.year}-${sem.sem}`)
  );

  // Group curriculum courses by semester
  const groupedCourses: Record<string, CurriculumCourse[]> = {};
  semesters.forEach((sem) => {
    const key = `${sem.year}-${sem.sem}`;
    groupedCourses[key] = curriculumCourses.filter(
      (cc) => cc.semester_year === sem.year && cc.semester_name === sem.sem
    );
  });

  // Sort semesters by year and semester
  const sortedSemesters = [...semesters].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;

    const semOrder = { first: 0, second: 1, midyear: 2 };
    return (
      semOrder[a.sem as keyof typeof semOrder] -
      semOrder[b.sem as keyof typeof semOrder]
    );
  });

  // Get contribution levels for a specific course and PO
  const getContributionLevels = (
    courseCode: string,
    poCode: string
  ): string[] => {
    const mapping = localMappings.find(
      (m) => m.course_code === courseCode && m.po_code === poCode
    );
    return mapping ? mapping.ied : [];
  };

  // Toggle a contribution level for a specific course and PO
  const toggleContributionLevel = (
    courseCode: string,
    poCode: string,
    level: string
  ) => {
    const currentLevels = getContributionLevels(courseCode, poCode);
    let newLevels: string[];

    if (currentLevels.includes(level)) {
      // Remove the level if it already exists
      newLevels = currentLevels.filter((l) => l !== level);
    } else {
      // Add the level if it doesn't exist
      newLevels = [...currentLevels, level];
    }

    // Update the mapping
    const existingMappingIndex = localMappings.findIndex(
      (m) => m.course_code === courseCode && m.po_code === poCode
    );

    let updatedMappings: CoursePOMapping[];

    if (existingMappingIndex >= 0) {
      // Update existing mapping
      updatedMappings = [...localMappings];

      if (newLevels.length === 0) {
        // Remove mapping if no levels are selected
        updatedMappings.splice(existingMappingIndex, 1);
      } else {
        // Update levels
        updatedMappings[existingMappingIndex] = {
          ...updatedMappings[existingMappingIndex],
          ied: newLevels,
        };
      }
    } else if (newLevels.length > 0) {
      // Add new mapping
      updatedMappings = [
        ...localMappings,
        { course_code: courseCode, po_code: poCode, ied: newLevels },
      ];
    } else {
      // No changes needed
      return;
    }

    setLocalMappings(updatedMappings);
    updateCoursePOMappings(updatedMappings);
  };

  // Get the color for a contribution level badge
  const getLevelBadgeColor = (level: string) => {
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
  const getLevelFullName = (level: string) => {
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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 mb-4">
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Select a Course to Map</h3>
        </div>

        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Select a course to map" />
          </SelectTrigger>
          <SelectContent>
            {curriculumCourses.map((course) => {
              const courseDetails = courses.find(
                (c) => c.code === course.course_code
              );
              return (
                <SelectItem
                  key={`${course.course_code}-${course.semester_year}-${course.semester_name}`}
                  value={course.course_code}
                >
                  {course.course_code} -{" "}
                  {courseDetails?.descriptive_title || "Unknown"}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {selectedCourse && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Mapping for: {selectedCourse} -{" "}
            {courses.find((c) => c.code === selectedCourse)?.descriptive_title}
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
              {pos.map((po) => {
                const contributionLevels = getContributionLevels(
                  selectedCourse,
                  po.name
                );

                return (
                  <TableRow key={po.name}>
                    <TableCell className="font-medium border">
                      {po.name}
                    </TableCell>
                    <TableCell className="border">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{po.name}</span>
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
                            <span>{po.statement.substring(0, 40)}...</span>
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
                            <h4 className="font-medium">Contribution Levels</h4>
                            <div className="space-y-2">
                              {(["I", "E", "D"] as string[]).map((level) => (
                                <div
                                  key={level}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`level-${po.name}-${level}`}
                                    checked={contributionLevels.includes(level)}
                                    onCheckedChange={() =>
                                      toggleContributionLevel(
                                        selectedCourse,
                                        po.name,
                                        level
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={`level-${po.name}-${level}`}
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
                              ))}
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

      <Card>
        <CardHeader>
          <CardTitle>Curriculum Mapping Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion
            type="multiple"
            value={expandedSemesters}
            onValueChange={setExpandedSemesters}
            className="space-y-4"
          >
            {sortedSemesters.map((sem) => {
              const key = `${sem.year}-${sem.sem}`;
              const semesterCourses = groupedCourses[key] || [];

              if (semesterCourses.length === 0) return null;

              return (
                <AccordionItem
                  key={key}
                  value={key}
                  className="border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                    <h3 className="text-xl font-medium">
                      Year {sem.year} - {getSemesterName(sem.sem)}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <div className="overflow-x-auto">
                      <TooltipProvider>
                        <Table className="border">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="border">Course</TableHead>
                              {pos.map((po) => (
                                <TableHead
                                  key={po.name}
                                  className="border text-center"
                                >
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-help">
                                        {po.name}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className="max-w-md"
                                    >
                                      <p>{po.statement}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {semesterCourses.map((course) => {
                              const courseDetails = courses.find(
                                (c) => c.code === course.course_code
                              );

                              return (
                                <TableRow key={course.course_code}>
                                  <TableCell className="border font-medium">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="cursor-help">
                                          {course.course_code}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent side="right">
                                        <p>
                                          {courseDetails?.descriptive_title ||
                                            "Unknown"}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TableCell>
                                  {pos.map((po) => {
                                    const levels = getContributionLevels(
                                      course.course_code,
                                      po.name
                                    );

                                    return (
                                      <TableCell
                                        key={po.name}
                                        className="border text-center"
                                      >
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <div className="cursor-pointer">
                                              {levels.length > 0 ? (
                                                <div className="flex justify-center gap-1">
                                                  {levels.map(
                                                    (level, levelIndex) => (
                                                      <Badge
                                                        key={levelIndex}
                                                        className={getLevelBadgeColor(
                                                          level
                                                        )}
                                                      >
                                                        {level}
                                                      </Badge>
                                                    )
                                                  )}
                                                </div>
                                              ) : (
                                                <span className="text-muted-foreground">
                                                  -
                                                </span>
                                              )}
                                            </div>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-[200px] p-4">
                                            <div className="space-y-4">
                                              <h4 className="font-medium">
                                                Contribution Levels
                                              </h4>
                                              <div className="space-y-2">
                                                {(
                                                  ["I", "E", "D"] as string[]
                                                ).map((level) => (
                                                  <div
                                                    key={level}
                                                    className="flex items-center space-x-2"
                                                  >
                                                    <Checkbox
                                                      id={`level-${course.course_code}-${po.name}-${level}`}
                                                      checked={levels.includes(
                                                        level
                                                      )}
                                                      onCheckedChange={() =>
                                                        toggleContributionLevel(
                                                          course.course_code,
                                                          po.name,
                                                          level
                                                        )
                                                      }
                                                    />
                                                    <Label
                                                      htmlFor={`level-${course.course_code}-${po.name}-${level}`}
                                                      className="flex items-center gap-2"
                                                    >
                                                      <Badge
                                                        className={getLevelBadgeColor(
                                                          level
                                                        )}
                                                      >
                                                        {level}
                                                      </Badge>
                                                      <span>
                                                        {getLevelFullName(
                                                          level
                                                        )}
                                                      </span>
                                                    </Label>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TooltipProvider>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
