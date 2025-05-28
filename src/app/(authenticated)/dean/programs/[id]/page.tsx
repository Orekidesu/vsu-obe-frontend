"use client";
import React from "react";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";

import ProgramReviewPage from "@/components/dean-components/ProgramReview";

const ActiveProgramPage = () => {
  const params = useParams();
  const id = Number(params.id);
  return (
    <div>
      <ProgramReviewPage proposalId={id} />
    </div>
  );
};

export default ActiveProgramPage;
