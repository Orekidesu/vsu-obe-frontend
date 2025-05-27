"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Check,
  FileEdit,
  ChevronDown,
  ChevronRight,
  Calendar,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import {
  sampleRevisionRequests,
  sampleProgramProposalRaw,
  sampleCurriculumCourses,
  getSectionDisplayName,
  formatDate,
} from "@/store/revision/sample-data/proposalData";

import {
  TransformedProgramData,
  transformProposalData,
} from "@/components/dean-components/revision-review-components/course-revision-components/types";

import { transformCourseData } from "@/components/dean-components/revision-review-components/course-revision-components/types";

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
import { CourseOutcomeCard } from "@/components/dean-components/revision-review-components/course-revision-components/CourseOutcomeCard";
import { ABCDMappingCard } from "@/components/dean-components/revision-review-components/course-revision-components/ABCDMappingCard ";
import { CPAClassificationCard } from "@/components/dean-components/revision-review-components/course-revision-components/CPAClassificationCard";
import { POMappingCard } from "@/components/dean-components/revision-review-components/course-revision-components/COPOMappingCard";
import { AssessmentTasksCard } from "@/components/dean-components/revision-review-components/course-revision-components/AssessmentTaskCard";
import { TeachingLearningCard } from "@/components/dean-components/revision-review-components/course-revision-components/TeachingLearningMethodCard";

interface ProgramRevisionReviewProps {
  proposalId: number;
}

export default function ProgramRevisionReview({
  proposalId,
}: ProgramRevisionReviewProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("program");
  const [activeCourseTab, setActiveCourseTab] = useState("103");
  const [transformedData, setTransformedData] =
    useState<TransformedProgramData | null>(null);

  // Transform the raw API data on component mount
  useEffect(() => {
    // In a real implementation, you would fetch the data using the proposalId
    console.log(`Fetching proposal data for ID: ${proposalId}`);
    const transformed = transformProposalData(sampleProgramProposalRaw);
    setTransformedData(transformed);
  }, [proposalId]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const programData = sampleProgramProposalRaw;
  const revisionData = sampleRevisionRequests;
  const coursesData = sampleCurriculumCourses.data;

  // Get courses that have revisions
  const coursesWithRevisions = revisionData.committee_revisions.map(
    (courseRev) => {
      const courseData = coursesData.find(
        (course) => course.id === courseRev.curriculum_course_id
      );
      return {
        ...courseRev,
        courseData,
      };
    }
  );

  const handleApprove = () => {
    console.log("Approving program proposal...");
  };

  const handleRequestRevisions = () => {
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
            graduateAttributes={programData.peos.flatMap(
              (peo) => peo.graduate_attributes
            )}
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
            graduateAttributes={programData.pos.flatMap(
              (po) => po.graduate_attributes
            )}
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

  if (!transformedData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Program Information Header */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {programData.program.name} ({programData.program.abbreviation}
                  )
                </h1>
                <p className="text-gray-600 mt-1">
                  Review and take action on the proposed program
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRequestRevisions}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <FileEdit className="w-4 h-4 mr-2" />
                  Request Revisions
                </Button>
              </div>
            </div>
          </div>

          {/* Program Basic Information */}
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {programData.program.name} ({programData.program.abbreviation}
                  )
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Program Name</p>
                    <p className="font-medium">
                      {transformedData.program.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Abbreviation</p>
                    <p className="font-medium">
                      {transformedData.program.abbreviation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Curriculum Name</p>
                    <p className="font-medium">
                      {transformedData.curriculum.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Courses</p>
                    <p className="font-medium">
                      {transformedData.courses.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Department Revision Requests
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Review the sections that require revision at the program level
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {revisionData.department_revisions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No program-level revisions requested</p>
                  </div>
                ) : (
                  revisionData.department_revisions.map((revision) => (
                    <Collapsible
                      key={revision.id}
                      open={openSections[`dept-${revision.id}`]}
                      onOpenChange={() => toggleSection(`dept-${revision.id}`)}
                    >
                      <CollapsibleTrigger asChild>
                        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {openSections[`dept-${revision.id}`] ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                                <div>
                                  <h4 className="font-medium">
                                    {getSectionDisplayName(revision.section)}
                                  </h4>
                                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(revision.created_at)}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-orange-700 border-orange-200"
                              >
                                Revised Section
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 ml-7 space-y-4">
                          {/* Revision Details */}
                          <Card>
                            <CardContent className="p-4">
                              <div>
                                <h5 className="font-medium text-sm text-gray-700 mb-2">
                                  Revision Details:
                                </h5>
                                <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                                  <p className="text-sm text-orange-800">
                                    {revision.details}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Section Content */}
                          <div>
                            <h5 className="font-medium text-sm text-gray-700 mb-2">
                              Updated Data:
                            </h5>
                            {renderSectionContent(revision.section)}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Revisions Tab */}
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Revision Requests
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Review the sections that require revision for each course
                </p>
              </CardHeader>
              <CardContent>
                {coursesWithRevisions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No course-level revisions requested</p>
                  </div>
                ) : (
                  <Tabs
                    value={activeCourseTab}
                    onValueChange={setActiveCourseTab}
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      {coursesWithRevisions.map((courseRev) => (
                        <TabsTrigger
                          key={courseRev.curriculum_course_id}
                          value={courseRev.curriculum_course_id.toString()}
                          className="flex items-center gap-2"
                        >
                          <span className="font-mono text-xs">
                            {courseRev.course_code}
                          </span>
                          <Badge variant="secondary" className="ml-1">
                            {courseRev.revisions.length}
                          </Badge>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {coursesWithRevisions.map((courseRev) => (
                      <TabsContent
                        key={courseRev.curriculum_course_id}
                        value={courseRev.curriculum_course_id.toString()}
                        className="space-y-4"
                      >
                        {/* Course Information */}
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-blue-900">
                                  {courseRev.course_code}:{" "}
                                  {courseRev.course_title}
                                </h3>
                                {courseRev.courseData && (
                                  <div className="flex items-center gap-4 mt-1 text-sm text-blue-700">
                                    <span>
                                      {
                                        courseRev.courseData.course_category
                                          .name
                                      }{" "}
                                      (
                                      {
                                        courseRev.courseData.course_category
                                          .code
                                      }
                                      )
                                    </span>
                                    <span>•</span>
                                    <span>
                                      Year {courseRev.courseData.semester.year},{" "}
                                      {courseRev.courseData.semester.sem}{" "}
                                      Semester
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {courseRev.courseData.units} Units
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Course Revision Requests */}
                        <div className="space-y-3">
                          {courseRev.revisions.map((revision) => (
                            <Collapsible
                              key={revision.id}
                              open={openSections[`course-${revision.id}`]}
                              onOpenChange={() =>
                                toggleSection(`course-${revision.id}`)
                              }
                            >
                              <CollapsibleTrigger asChild>
                                <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        {openSections[
                                          `course-${revision.id}`
                                        ] ? (
                                          <ChevronDown className="w-4 h-4 text-gray-500" />
                                        ) : (
                                          <ChevronRight className="w-4 h-4 text-gray-500" />
                                        )}
                                        <div>
                                          <h4 className="font-medium">
                                            {getSectionDisplayName(
                                              revision.section
                                            )}
                                          </h4>
                                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(revision.created_at)}
                                          </p>
                                        </div>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="text-orange-700 border-orange-200"
                                      >
                                        Revised Section
                                      </Badge>
                                    </div>
                                  </CardContent>
                                </Card>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <Card className="mt-2 ml-7">
                                  <CardContent className="p-4">
                                    <div>
                                      <h5 className="font-medium text-sm text-gray-700 mb-2">
                                        Revision Details:
                                      </h5>
                                      <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                                        <p className="text-sm text-orange-800">
                                          {revision.details}
                                        </p>
                                      </div>

                                      {/* Add transformed data for course outcomes */}

                                      {/* CO */}
                                      {revision.section === "course_outcomes" &&
                                        courseRev.courseData && (
                                          <div className="mt-4">
                                            <CourseOutcomeCard
                                              courseOutcomes={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).courseOutcomes
                                              }
                                              title="Course Outcomes"
                                            />
                                          </div>
                                        )}

                                      {/* ABCD */}
                                      {revision.section === "abcd" &&
                                        courseRev.courseData && (
                                          <div className="mt-4">
                                            <ABCDMappingCard
                                              courseOutcomes={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).courseOutcomes
                                              }
                                              abcdMappings={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).abcdMappings
                                              }
                                              title="ABCD Mapping"
                                            />
                                          </div>
                                        )}

                                      {/* CPA */}
                                      {revision.section === "cpa" &&
                                        courseRev.courseData && (
                                          <div className="mt-4">
                                            <CPAClassificationCard
                                              courseOutcomes={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).courseOutcomes
                                              }
                                              cpaMappings={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).cpaMappings
                                              }
                                              title="CPA Classification"
                                            />
                                          </div>
                                        )}
                                      {/* CO PO */}
                                      {revision.section === "po_mappings" &&
                                        courseRev.courseData && (
                                          <div className="mt-4">
                                            <POMappingCard
                                              courseOutcomes={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).courseOutcomes
                                              }
                                              programOutcomes={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).programOutcomes
                                              }
                                              poMappings={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).poMappings
                                              }
                                              title="PO Mapping"
                                            />
                                          </div>
                                        )}
                                      {/* Assesment Task */}
                                      {revision.section === "tla_tasks" &&
                                        courseRev.courseData && (
                                          <div className="mt-4">
                                            <AssessmentTasksCard
                                              courseOutcomes={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).courseOutcomes
                                              }
                                              assessmentTasks={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).assessmentTasks
                                              }
                                              title="Assessment Tasks"
                                            />
                                          </div>
                                        )}
                                      {/* TLA Method */}
                                      {revision.section === "tla_methods" &&
                                        courseRev.courseData && (
                                          <div className="mt-4">
                                            <TeachingLearningCard
                                              courseOutcomes={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).courseOutcomes
                                              }
                                              teachingMethods={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).teachingMethods
                                              }
                                              learningResources={
                                                transformCourseData(
                                                  courseRev.courseData
                                                ).learningResources
                                              }
                                              title="Teaching Methods & Learning Resources"
                                            />
                                          </div>
                                        )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
