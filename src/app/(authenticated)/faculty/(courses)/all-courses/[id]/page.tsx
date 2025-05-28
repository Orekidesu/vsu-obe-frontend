"use client";

import { useParams } from "next/navigation";
import { CurriculumCourseDetails } from "@/components/commons/course-details/course-details";

export default function CourseDetailsPage() {
  const params = useParams();
  const curriculumCourseId = params.id as string;

  return <CurriculumCourseDetails curriculumCourseId={curriculumCourseId} />;
}
