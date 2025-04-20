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
import { ContributionLegend } from "./contribution-level";

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
  ird: string[];
}

interface CoursePOMappingProps {
  courses: Course[];
  pos: PO[];
  semesters: Semester[];
  curriculumCourses: CurriculumCourse[];
  coursePOMappings: CoursePOMapping[];
  getSemesterName: (semesterCode: string) => string;
  getLevelBadgeColor: (level: string) => string;
}

export function CoursePOMapping({
  courses,
  pos,
  semesters,
  curriculumCourses,
  coursePOMappings,
  getSemesterName,
  getLevelBadgeColor,
}: CoursePOMappingProps) {
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
    const mapping = coursePOMappings.find(
      (m) => m.course_code === courseCode && m.po_code === poCode
    );
    return mapping ? mapping.ird : [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course to PO Mapping</CardTitle>
      </CardHeader>
      <CardContent>
        <ContributionLegend getLevelBadgeColor={getLevelBadgeColor} />

        <Accordion
          type="multiple"
          defaultValue={Object.keys(groupedCourses)}
          className="mt-6 space-y-4"
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
                            {pos.map((po, index) => (
                              <TableHead
                                key={index}
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
                                      {levels.length > 0 ? (
                                        <div className="flex justify-center gap-1">
                                          {levels.map((level, levelIndex) => (
                                            <Badge
                                              key={levelIndex}
                                              className={getLevelBadgeColor(
                                                level
                                              )}
                                            >
                                              {level}
                                            </Badge>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-muted-foreground">
                                          -
                                        </span>
                                      )}
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
  );
}
