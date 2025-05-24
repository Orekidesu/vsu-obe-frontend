"use client";

import { useParams } from "next/navigation";

export default function RevisionPage() {
  const params = useParams();
  const curriculumCourseId = params.id as string;

  return (
    <>
      <div>
        <div>Edit Curriculum Course Page of {curriculumCourseId}</div>
      </div>
    </>
  );
}
