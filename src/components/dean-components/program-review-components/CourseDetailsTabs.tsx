"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseDetails } from "./CourseDetails";
import { CourseOutcomes } from "./CourseOutcomes";
import { CourseAssessments } from "./CourseAssessments";

interface CourseDetailsCourse {
  id: number;
  course: {
    id: number;
    code: string;
    descriptive_title: string;
  };
  category: {
    id: number;
    name: string;
    code: string;
  };
  semester: {
    id: number;
    year: number;
    sem: string;
  };
  units: string;
  po_mappings: Array<{
    po_id: number;
    po_name: string;
    ird: string;
  }>;
}

interface CourseDetailsTabsProps {
  courses: CourseDetailsCourse[];
  courseDetailsMap: Record<number, any>;
}

export function CourseDetailsTabs({
  courses,
  courseDetailsMap,
}: CourseDetailsTabsProps) {
  const [activeCourseTab, setActiveCourseTab] = useState(
    courses[0]?.id.toString() || ""
  );
  const [activeDetailTab, setActiveDetailTab] = useState("details");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeCourseTab}
          onValueChange={setActiveCourseTab}
          className="mb-6"
        >
          <TabsList className="mb-4 flex flex-wrap h-auto">
            {courses.map((course) => (
              <TabsTrigger
                key={course.id}
                value={course.id.toString()}
                className="mb-1"
              >
                {course.course.code}
              </TabsTrigger>
            ))}
          </TabsList>

          {courses.map((course) => {
            const courseDetails = courseDetailsMap[course.id];

            return (
              <TabsContent key={course.id} value={course.id.toString()}>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">
                    {course.course.code}: {course.course.descriptive_title}
                  </h3>
                  <p className="text-muted-foreground">
                    {course.category.name} • {course.semester.year} Year,{" "}
                    {course.semester.sem === "first"
                      ? "First"
                      : course.semester.sem === "second"
                        ? "Second"
                        : "Midyear"}{" "}
                    Semester • {course.units} Units
                  </p>
                </div>

                <Tabs
                  value={activeDetailTab}
                  onValueChange={setActiveDetailTab}
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Course Details</TabsTrigger>
                    <TabsTrigger value="outcomes">Course Outcomes</TabsTrigger>
                    <TabsTrigger value="assessments">Assessments</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details">
                    {courseDetails ? (
                      <CourseDetails
                        course={courseDetails.course}
                        course_category={courseDetails.course_category}
                        semester={courseDetails.semester}
                        units={courseDetails.units}
                      />
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">
                          Course details not available
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="outcomes">
                    {courseDetails ? (
                      <CourseOutcomes
                        outcomes={courseDetails.course_outcomes || []}
                      />
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">
                          Course outcomes not available
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="assessments">
                    {courseDetails ? (
                      <CourseAssessments
                        outcomes={courseDetails.course_outcomes || []}
                      />
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">
                          Assessment information not available
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
