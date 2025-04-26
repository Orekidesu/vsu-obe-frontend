import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Mission } from "@/types/model/Mission";
import { GraduateAttribute } from "@/types/model/GraduateAttributes";
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight, CheckCircle2 } from "lucide-react";

import type {
  ProgramOutcome,
  YearSemester,
  CourseCategory,
  CurriculumCourse,
  CourseToPOMapping,
  Committee,
} from "@/store/wizard-store";

// Import sub-components
import { ProgramDetailsSection } from "./review-components/ProgramDetailSection";
import { PEOSection } from "./review-components/PEOSection";
import { PEOMissionMappingSection } from "./review-components/PEOToMIssionSection";
import { GAPEOMappingSection } from "./review-components/GAToPEOSection";
import { ProgramOutcomesSection } from "./review-components/ProgramOutcomeSection";
import { POPEOMappingSection } from "./review-components/POToPEOSection";
import { POGAMappingSection } from "./review-components/POToGASection";
import { CurriculumStructureSection } from "./review-components/CurriculumStructureSection";
import { CourseCategoriesSection } from "./review-components/CourseCategorySection";
import { CurriculumCoursesSection } from "./review-components/CurriculumCourseSection";
import { CoursePOMappingSection } from "./review-components/CourseToPOSection";
import { FinalConfirmation } from "./review-components/FinalConfirmation";

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
  selectedCommittees: number[];
  committees: Committee[];

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
  selectedCommittees,
  committees,
  goToStep,
}: ReviewStepProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "program-details",
    "peos",
    "program-outcomes",
    "curriculum",
  ]);

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
          <ProgramDetailsSection
            formType={formType}
            programName={programName}
            programAbbreviation={programAbbreviation}
            selectedProgram={selectedProgram}
            curriculumName={curriculumName}
            academicYear={academicYear}
            goToStep={goToStep}
          />

          <PEOSection peos={peos} goToStep={goToStep} />

          <PEOMissionMappingSection
            peos={peos}
            missions={missions}
            peoToMissionMappings={peoToMissionMappings}
            goToStep={goToStep}
          />

          <GAPEOMappingSection
            peos={peos}
            graduateAttributes={graduateAttributes}
            gaToPEOMappings={gaToPEOMappings}
            goToStep={goToStep}
          />

          <ProgramOutcomesSection
            programOutcomes={programOutcomes}
            goToStep={goToStep}
          />

          <POPEOMappingSection
            peos={peos}
            programOutcomes={programOutcomes}
            poToPEOMappings={poToPEOMappings}
            goToStep={goToStep}
          />

          <POGAMappingSection
            programOutcomes={programOutcomes}
            graduateAttributes={graduateAttributes}
            poToGAMappings={poToGAMappings}
            goToStep={goToStep}
          />

          <CurriculumStructureSection
            yearSemesters={yearSemesters}
            goToStep={goToStep}
          />

          <CourseCategoriesSection
            courseCategories={courseCategories}
            goToStep={goToStep}
          />

          <CurriculumCoursesSection
            yearSemesters={yearSemesters}
            courseCategories={courseCategories}
            curriculumCourses={curriculumCourses}
            goToStep={goToStep}
          />

          <CoursePOMappingSection
            programOutcomes={programOutcomes}
            curriculumCourses={curriculumCourses}
            courseToPOMappings={courseToPOMappings}
            goToStep={goToStep}
          />
          {/* Add a new section for committees in the ReviewStep component */}
          {/* This should be added inside the Accordion component, before the submit confirmation section */}
          <AccordionItem
            value="committees"
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-medium">Assigned Committees</h3>
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
                {selectedCommittees.length === 0 ? (
                  <div className="text-center p-6 border rounded-md bg-muted/20">
                    <p>
                      No committees assigned yet. Please assign at least one
                      committee member.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedCommittees.map((committeeId) => {
                      const committee = committees.find(
                        (c) => c.id === committeeId
                      );
                      if (!committee) return null;
                      return (
                        <div
                          key={committeeId}
                          className="border rounded-md p-4"
                        >
                          <h3 className="font-medium">
                            {committee.first_name} {committee.last_name}
                          </h3>
                          <Badge variant="outline" className="mt-1">
                            Committee Member
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <FinalConfirmation />
      </div>
    </>
  );
}
