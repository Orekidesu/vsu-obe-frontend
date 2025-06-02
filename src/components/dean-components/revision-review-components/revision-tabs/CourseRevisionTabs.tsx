import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Calendar, BookOpen } from "lucide-react";
import {
  formatDate,
  getSectionDisplayName,
} from "@/store/revision/sample-data/proposalData";
import { transformCourseData } from "@/components/dean-components/revision-review-components/types";
import { CourseOutcomeCard } from "@/components/dean-components/revision-review-components/course-revision-components/CourseOutcomeCard";
import { ABCDMappingCard } from "@/components/dean-components/revision-review-components/course-revision-components/ABCDMappingCard ";
import { CPAClassificationCard } from "@/components/dean-components/revision-review-components/course-revision-components/CPAClassificationCard";
import { POMappingCard } from "@/components/dean-components/revision-review-components/course-revision-components/COPOMappingCard";
import { AssessmentTasksCard } from "@/components/dean-components/revision-review-components/course-revision-components/AssessmentTaskCard";
import { TeachingLearningCard } from "@/components/dean-components/revision-review-components/course-revision-components/TeachingLearningMethodCard";
import { useState } from "react";
import { CourseRevision, CourseWithRevisions } from "./revisionType";

interface CourseRevisionTabsProps {
  coursesWithRevisions: CourseWithRevisions[];
  openSections: Record<string, boolean>;
  toggleSection: (sectionId: string) => void;
}

export function CourseRevisionTabs({
  coursesWithRevisions,
  openSections,
  toggleSection,
}: CourseRevisionTabsProps) {
  const [activeCourseTab, setActiveCourseTab] = useState(
    coursesWithRevisions.length > 0
      ? coursesWithRevisions[0].curriculum_course_id.toString()
      : ""
  );

  return (
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
          <Tabs value={activeCourseTab} onValueChange={setActiveCourseTab}>
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
                <Card className=" border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary p-2 rounded-lg">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {courseRev.course_code}: {courseRev.course_title}
                        </h3>
                        {courseRev.courseData && (
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            <span>
                              {courseRev.courseData.course_category.name} (
                              {courseRev.courseData.course_category.code})
                            </span>
                            <span>•</span>
                            <span>
                              Year {courseRev.courseData.semester.year},{" "}
                              {courseRev.courseData.semester.sem} Semester
                            </span>
                            <span>•</span>
                            <span>{courseRev.courseData.units} Units</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Revision Requests */}
                <div className="space-y-3">
                  {courseRev.revisions.map((revision: CourseRevision) => (
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
                                {openSections[`course-${revision.id}`] ? (
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
                              {courseRev.courseData && (
                                <>
                                  {/* CO */}
                                  {revision.section === "course_outcomes" && (
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
                                  {revision.section === "abcd" && (
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
                                  {revision.section === "cpa" && (
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
                                  {revision.section === "po_mappings" && (
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

                                  {/* Assessment Task */}
                                  {revision.section === "tla_tasks" && (
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
                                  {revision.section ===
                                    "tla_assessment_method" && (
                                    <div className="mt-4">
                                      <TeachingLearningCard
                                        courseOutcomes={
                                          // Use the raw course outcomes from courseData instead of transformed data
                                          courseRev.courseData?.course_outcomes
                                        }
                                        title="Teaching Methods & Learning Resources"
                                      />
                                    </div>
                                  )}
                                </>
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
  );
}
