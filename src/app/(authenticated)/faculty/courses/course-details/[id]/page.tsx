"use client";

import { WizardFormCourse } from "@/components/committee-components/WizardFormCourse";
import { useParams } from "next/navigation";

export default function CourseDetailsPage() {
  // Get the course ID from the URL
  const params = useParams();
  const courseId = params.id as string;

  return (
    <div className="flex justify-center items-center h-full">
      <WizardFormCourse courseId={courseId} />
    </div>
  );
}
