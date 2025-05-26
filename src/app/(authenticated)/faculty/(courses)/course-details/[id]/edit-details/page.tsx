"use client";

import { useParams } from "next/navigation";
import { CurriculumCourseRevisionWizard } from "@/components/committee-components/revise-proposal/WizardCurriculumCourseRevision";

export default function RevisionPage() {
  const params = useParams();
  const curriculumCourseId = params.id as string;

  return (
    <CurriculumCourseRevisionWizard curriculumCourseId={curriculumCourseId} />
  );
}
