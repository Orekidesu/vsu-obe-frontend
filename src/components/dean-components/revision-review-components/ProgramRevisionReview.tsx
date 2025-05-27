"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BookOpen, GraduationCap, Loader2, AlertTriangle } from "lucide-react";
import { getSectionDisplayName } from "@/store/revision/sample-data/proposalData";

import {
  TransformedProgramData,
  transformProposalData,
} from "@/components/dean-components/revision-review-components/types";

import { ProgramDetails } from "@/components/dean-components/revision-review-components/ProgramDetails";
import { ProgramEducationalObjectives } from "@/components/dean-components/revision-review-components/PEO";
import { ProgramOutcomes } from "@/components/dean-components/revision-review-components/ProgramOutcomes";
import { CurriculumDetails } from "@/components/dean-components/revision-review-components/CurriculumDetails";
import { CourseCategories } from "@/components/dean-components/revision-review-components/CourseCategories";
import { PEOMissionMapping } from "@/components/dean-components/revision-review-components/PEOMissionMapping";
import { GAPEOMapping } from "@/components/dean-components/revision-review-components/GAPEOMapping";
import { POPEOMapping } from "@/components/dean-components/revision-review-components/POPEOMapping";
import { POGAMapping } from "@/components/dean-components/revision-review-components/POGAMapping";
import { CoursePOMapping } from "@/components/dean-components/revision-review-components/CoursePOMapping";
import { CurriculumCourses } from "@/components/dean-components/revision-review-components/CurriculumCourse";

import { ProgramRevisionTabs } from "./revision-tabs/ProgramRevisionTabs";
import { CourseRevisionTabs } from "./revision-tabs/CourseRevisionTabs";
import useProgramProposals from "@/hooks/department/useProgramProposal";
import useCourseDepartmentRevision from "@/hooks/shared/useCourseDepartmentRevision";
import useCurriculumCourses from "@/hooks/faculty-member/useCourseCurriculum";
import { useQueries } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { ProgramHeader } from "@/components/commons/program-details/program-header";
import { ProgramSummary } from "@/components/commons/program-details/program-summary";

interface ProgramRevisionReviewProps {
  proposalId: number;
}

export default function ProgramRevisionReview({
  proposalId,
}: ProgramRevisionReviewProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("program");
  const [transformedData, setTransformedData] =
    useState<TransformedProgramData | null>(null);
  const { getProgramProposalFromCache, submitProposalReview } =
    useProgramProposals({ role: "dean" });
  const { toast } = useToast();

  // Fetch program proposal data
  const {
    data: programData,
    isLoading: isLoadingProgram,
    error: programError,
  } = useQuery({
    ...getProgramProposalFromCache(proposalId),
    enabled: !!proposalId,
  });

  const {
    revisionData,
    isLoading: isLoadingRevisions,
    error: revisionsError,
  } = useCourseDepartmentRevision(proposalId, { role: "dean" });

  const { getCurriculumCourseFromCache } = useCurriculumCourses({
    role: "dean",
    includeOutcomes: true,
  });

  // Transform the fetched API data
  useEffect(() => {
    if (programData) {
      const transformed = transformProposalData(programData);
      setTransformedData(transformed);
    }
  }, [programData]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Get courses that have revisions
  const courseQueries = useQueries({
    queries: (revisionData?.committee_revisions || []).map((courseRev) => ({
      ...getCurriculumCourseFromCache(courseRev.curriculum_course_id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  const isLoadingCourses = courseQueries.some((query) => query.isLoading);
  const coursesWithRevisions = (revisionData?.committee_revisions || []).map(
    (courseRev, index) => ({
      ...courseRev,
      courseData: courseQueries[index].data,
    })
  );

  const handleApprove = () => {
    // Call API to approve the proposal
    submitProposalReview.mutate(
      {
        proposalId,
        reviewData: {
          status: "approved",
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Program proposal has been approved",
            variant: "success",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to approve proposal",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleRequestRevisions = () => {
    // In a real implementation, this would open a form to request revisions
    console.log("Requesting additional revisions...");
  };

  // Function to render section content based on section type
  const renderSectionContent = (sectionKey: string) => {
    if (!transformedData) return null;

    switch (sectionKey) {
      case "program":
        return <ProgramDetails program={transformedData.program} />;
      case "peos":
        return <ProgramEducationalObjectives peos={transformedData.peos} />;
      case "pos":
        return <ProgramOutcomes pos={transformedData.pos} />;
      case "curriculum":
        return (
          <CurriculumDetails
            curriculum={transformedData.curriculum}
            courses={transformedData.courses}
          />
        );
      case "course_categories":
        return (
          <CourseCategories categories={transformedData.course_categories} />
        );
      case "peo_mission_mappings":
        return (
          <PEOMissionMapping
            peos={transformedData.peos}
            missions={transformedData.missions}
            mappings={transformedData.peo_mission_mappings}
          />
        );
      case "ga_peo_mappings":
        return (
          <GAPEOMapping
            peos={transformedData.peos}
            graduateAttributes={
              programData?.peos?.flatMap(
                (peo) => peo.graduate_attributes || []
              ) || []
            }
            mappings={transformedData.ga_peo_mappings}
          />
        );
      case "po_peo_mappings":
        return (
          <POPEOMapping
            pos={transformedData.pos}
            peos={transformedData.peos}
            mappings={transformedData.po_peo_mappings}
          />
        );
      case "po_ga_mappings":
        return (
          <POGAMapping
            pos={transformedData.pos}
            graduateAttributes={
              programData?.peos?.flatMap(
                (peo) => peo.graduate_attributes || []
              ) || []
            }
            mappings={transformedData.po_ga_mappings}
          />
        );
      case "curriculum_courses":
        return (
          <CurriculumCourses
            curriculumCourses={transformedData.curriculum_courses}
            courses={transformedData.courses}
            categories={transformedData.course_categories}
          />
        );

      case "course_po_mappings":
        return (
          <CoursePOMapping
            courses={transformedData.courses}
            pos={transformedData.pos}
            mappings={transformedData.course_po_mappings}
          />
        );
      default:
        return (
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-600">
                Section content not yet implemented:{" "}
                {getSectionDisplayName(sectionKey)}
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  // Loading state for either program data or revisions
  const isLoading = isLoadingProgram || isLoadingRevisions || isLoadingCourses;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-gray-600">Loading proposal data...</p>
        </div>
      </div>
    );
  }

  // Error state for either program data or revisions
  const error = programError || revisionsError;
  if (error || !programData || !revisionData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 max-w-md text-center">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <h3 className="text-lg font-semibold text-red-600">
            Failed to load data
          </h3>
          <p className="text-gray-600">
            {error instanceof Error
              ? error.message
              : "Could not load the requested data."}
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!transformedData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 max-w-md text-center">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
          <h3 className="text-lg font-semibold text-yellow-600">
            No proposal data available
          </h3>
          <p className="text-gray-600">
            Could not find data for the requested program proposal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Program Information Header */}
      <ProgramHeader
        programName={transformedData.program.name}
        programAbbreviation={transformedData.program.abbreviation}
        actionTaken={""}
        onApprove={handleApprove}
        onRevise={handleRequestRevisions}
        // onReject={handleReject}
        role="Dean"
      />

      {/* Program Summary */}
      <ProgramSummary
        programName={transformedData.program.name}
        programAbbreviation={transformedData.program.abbreviation}
        curriculumName={transformedData.curriculum.name}
        totalCourses={transformedData.curriculum_courses.length}
        status="revision"
      />

      {/* Revision Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="program" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Program Revisions
            {revisionData.department_revisions.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {revisionData.department_revisions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Course Revisions
            {coursesWithRevisions.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {coursesWithRevisions.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Program Revisions Tab */}
        <TabsContent value="program" className="space-y-4">
          <ProgramRevisionTabs
            revisionData={revisionData}
            openSections={openSections}
            toggleSection={toggleSection}
            renderSectionContent={renderSectionContent}
          />
        </TabsContent>

        {/* Course Revisions Tab */}
        <TabsContent value="courses" className="space-y-4">
          <CourseRevisionTabs
            coursesWithRevisions={coursesWithRevisions || []}
            openSections={openSections}
            toggleSection={toggleSection}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
