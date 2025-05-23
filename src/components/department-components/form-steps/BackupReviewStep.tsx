import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Mission } from "@/types/model/Mission";
import { GraduateAttribute } from "@/types/model/GraduateAttributes";
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";

import type {
  ProgramOutcome,
  YearSemester,
  CourseCategory,
  CurriculumCourse,
  CourseToPOMapping,
  ContributionLevel,
} from "@/store/wizard-store";

interface ReviewStepProps {
  formType: string;
  programName: string;
  programAbbreviation: string;
  selectedProgram: string;
  curriculumName: string;
  academicYear: string;
  yearSemesters: YearSemester[];
  courseCategories: CourseCategory[];
  curriculumCourses: CurriculumCourse[];
  courseToPOMappings: CourseToPOMapping[];
  peos: ProgramEducationalObjective[];
  programOutcomes: ProgramOutcome[];
  missions: Mission[];
  graduateAttributes: GraduateAttribute[];
  peoToMissionMappings: { peoId: number; missionId: number }[];
  gaToPEOMappings: { gaId: number; peoId: number }[];
  poToPEOMappings: { poId: number; peoId: number }[];
  poToGAMappings: { poId: number; gaId: number }[];
  goToStep: (step: number) => void;
}

export function ReviewStep({
  formType,
  programName,
  programAbbreviation,
  selectedProgram,
  curriculumName,
  academicYear,
  yearSemesters,
  courseCategories,
  curriculumCourses,
  courseToPOMappings,
  peos,
  programOutcomes,
  missions,
  graduateAttributes,
  peoToMissionMappings,
  gaToPEOMappings,
  poToPEOMappings,
  poToGAMappings,
  goToStep,
}: ReviewStepProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "program-details",
    "peos",
    "program-outcomes",
    "curriculum",
  ]);

  // Get semester display name
  const getSemesterName = (semesterCode: string) => {
    switch (semesterCode) {
      case "first":
        return "First Semester";
      case "second":
        return "Second Semester";
      case "midyear":
        return "Midyear";
      default:
        return semesterCode;
    }
  };

  // Get the color for a contribution level badge
  const getLevelBadgeColor = (level: ContributionLevel) => {
    switch (level) {
      case "I":
        return "bg-blue-100 text-blue-800";
      case "R":
        return "bg-green-100 text-green-800";
      case "D":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get contribution levels for a specific course and PO
  const getContributionLevels = (
    courseId: string,
    poId: number
  ): ContributionLevel[] => {
    const mapping = courseToPOMappings.find(
      (m) => m.courseId === parseInt(courseId, 10) && m.poId === poId
    );
    return mapping ? mapping.contributionLevels : [];
  };

  // Check if a PEO is mapped to a mission
  const isPEOToMissionMapped = (peoId: number, missionId: number) => {
    return peoToMissionMappings.some(
      (m) => m.peoId === peoId && m.missionId === missionId
    );
  };

  // Check if a GA is mapped to a PEO
  const isGAToPEOMapped = (gaId: number, peoId: number) => {
    return gaToPEOMappings.some((m) => m.gaId === gaId && m.peoId === peoId);
  };

  // Check if a PO is mapped to a PEO
  const isPOToPEOMapped = (poId: number, peoId: number) => {
    return poToPEOMappings.some((m) => m.poId === poId && m.peoId === peoId);
  };

  // Check if a PO is mapped to a GA
  const isPOToGAMapped = (poId: number, gaId: number) => {
    return poToGAMappings.some((m) => m.poId === poId && m.gaId === gaId);
  };

  // Group curriculum courses by year-semester
  const groupedCourses: Record<string, CurriculumCourse[]> = {};
  yearSemesters.forEach((ys) => {
    groupedCourses[ys.id] = curriculumCourses.filter(
      (cc) => cc.yearSemesterId === ys.id
    );
  });

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Review Your Program Proposal
      </h2>

      <div className="space-y-8">
        <p className="text-center text-muted-foreground">
          Please review all the information below before submitting your program
          proposal. If you need to make changes, click the &quot;Edit&quot;
          button next to each section to go back to that step.
        </p>

        <Accordion
          type="multiple"
          value={expandedSections}
          onValueChange={setExpandedSections}
          className="space-y-4"
        >
          {/* Program Details Section */}
          <AccordionItem
            value="program-details"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">Program Details</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(2)}
                  className="mr-4"
                >
                  Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Form Type
                    </h4>
                    <p className="text-lg">
                      {formType === "new"
                        ? "Create New Program"
                        : "Update Existing Program"}
                    </p>
                  </div>

                  {formType === "new" ? (
                    <>
                      <div>
                        <h4 className="font-medium text-muted-foreground">
                          Program Name
                        </h4>
                        <p className="text-lg">{programName}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-muted-foreground">
                          Program Abbreviation
                        </h4>
                        <p className="text-lg">{programAbbreviation}</p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h4 className="font-medium text-muted-foreground">
                        Selected Program
                      </h4>
                      <p className="text-lg">{selectedProgram}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Curriculum Name
                    </h4>
                    <p className="text-lg">{curriculumName}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Academic Year
                    </h4>
                    <p className="text-lg">{academicYear}</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* PEOs Section */}
          <AccordionItem
            value="peos"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">
                    Program Educational Objectives (PEOs)
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(3)}
                  className="mr-4"
                >
                  Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">PEO Number</TableHead>
                      <TableHead>Statement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {peos.map((peo) => (
                      <TableRow key={peo.id}>
                        <TableCell className="font-medium">
                          PEO {peo.id}
                        </TableCell>
                        <TableCell>{peo.statement}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* PEO to Mission Mapping Section */}
          <AccordionItem
            value="peo-mission-mapping"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">
                    PEO to Mission Mapping
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(4)}
                  className="mr-4"
                >
                  Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4 overflow-x-auto">
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border">PEOs</TableHead>
                      {missions.map((mission) => (
                        <TableHead
                          key={mission.id}
                          className="text-center border"
                        >
                          {mission.id}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {peos.map((peo) => (
                      <TableRow key={peo.id}>
                        <TableCell className="font-medium border">
                          PEO{peo.id}
                        </TableCell>
                        {missions.map((mission) => (
                          <TableCell
                            key={mission.id}
                            className="text-center border"
                          >
                            {isPEOToMissionMapped(peo.id, mission.id) ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* GA to PEO Mapping Section */}
          <AccordionItem
            value="ga-peo-mapping"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">
                    Graduate Attributes to PEO Mapping
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(5)}
                  className="mr-4"
                >
                  Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4 overflow-x-auto">
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border">GAs</TableHead>
                      {peos.map((peo) => (
                        <TableHead key={peo.id} className="text-center border">
                          PEO{peo.id}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {graduateAttributes.map((ga) => (
                      <TableRow key={ga.id}>
                        <TableCell className="font-medium border">
                          {ga.id}
                        </TableCell>
                        {peos.map((peo) => (
                          <TableCell
                            key={peo.id}
                            className="text-center border"
                          >
                            {isGAToPEOMapped(ga.id, peo.id) ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Program Outcomes Section */}
          <AccordionItem
            value="program-outcomes"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">
                    Program Outcomes (POs)
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(6)}
                  className="mr-4"
                >
                  Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">PO Number</TableHead>
                      <TableHead className="w-[150px]">Name</TableHead>
                      <TableHead>Statement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programOutcomes.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">
                          PO {po.id}
                        </TableCell>
                        <TableCell>{po.name}</TableCell>
                        <TableCell>{po.statement}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* PO to PEO Mapping Section */}
          <AccordionItem
            value="po-peo-mapping"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">PO to PEO Mapping</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(7)}
                  className="mr-4"
                >
                  Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4 overflow-x-auto">
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border">POs</TableHead>
                      {peos.map((peo) => (
                        <TableHead key={peo.id} className="text-center border">
                          PEO{peo.id}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programOutcomes.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium border">
                          PO{po.id}
                        </TableCell>
                        {peos.map((peo) => (
                          <TableCell
                            key={peo.id}
                            className="text-center border"
                          >
                            {isPOToPEOMapped(po.id, peo.id) ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* PO to GA Mapping Section */}
          <AccordionItem
            value="po-ga-mapping"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">PO to GA Mapping</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(8)}
                  className="mr-4"
                >
                  Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4 overflow-x-auto">
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border">POs</TableHead>
                      {graduateAttributes.map((ga) => (
                        <TableHead key={ga.id} className="text-center border">
                          {ga.id}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programOutcomes.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium border">
                          PO{po.id}
                        </TableCell>
                        {graduateAttributes.map((ga) => (
                          <TableCell key={ga.id} className="text-center border">
                            {isPOToGAMapped(po.id, ga.id) ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Curriculum Section */}
          <AccordionItem
            value="curriculum"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">Curriculum Structure</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(10)}
                  className="mr-4"
                >
                  Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4">
                <h4 className="font-medium">Year-Semester Combinations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {yearSemesters.map((ys) => (
                    <Card key={ys.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Year {ys.year}</span>
                          <Badge variant="outline">
                            {getSemesterName(ys.semester)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Course Categories Section */}
          <AccordionItem
            value="course-categories"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">Course Categories</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(11)}
                  className="mr-4"
                >
                  Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Code</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.code}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Curriculum Courses Section */}
          <AccordionItem
            value="curriculum-courses"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">Curriculum Courses</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(12)}
                  className="mr-4"
                >
                  Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-8">
                {yearSemesters.map((ys) => {
                  const courses = groupedCourses[ys.id] || [];
                  if (courses.length === 0) return null;

                  return (
                    <div key={ys.id} className="space-y-4">
                      <h4 className="font-medium">
                        Year {ys.year} - {getSemesterName(ys.semester)}
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course Code</TableHead>
                            <TableHead>Course Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Units</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courses.map((course) => (
                            <TableRow
                              key={`${course.id}-${course.yearSemesterId}`}
                            >
                              <TableCell>{course.code}</TableCell>
                              <TableCell>{course.descriptive_title}</TableCell>
                              <TableCell>
                                {courseCategories.find(
                                  (category) =>
                                    category.id === parseInt(course.categoryId)
                                )?.name || "Unknown"}{" "}
                                (
                                {courseCategories.find(
                                  (category) =>
                                    category.id ===
                                    parseInt(course.categoryId, 10)
                                )?.code || "?"}
                                )
                              </TableCell>
                              <TableCell>{course.units}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Course to PO Mapping Section */}
          <AccordionItem
            value="course-po-mapping"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">Course to PO Mapping</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(13)}
                  className="mr-4"
                >
                  Edit <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4">
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
                            {course.code}
                          </TableCell>
                          {programOutcomes.map((po) => {
                            const levels = getContributionLevels(
                              course.id.toString(),
                              po.id
                            );
                            return (
                              <TableCell
                                key={po.id}
                                className="border text-center"
                              >
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
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 p-6 border rounded-lg bg-muted/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-medium">Final Confirmation</h3>
          </div>
          <p>
            Please ensure all information is correct before submitting. Once
            submitted, your program proposal will be sent for review and
            approval.
          </p>
        </div>
      </div>
    </>
  );
}
