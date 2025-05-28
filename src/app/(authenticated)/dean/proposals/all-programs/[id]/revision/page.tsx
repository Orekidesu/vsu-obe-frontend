"use client";
import React from "react";
import { useParams } from "next/navigation";

import ProgramRevisionReview from "@/components/dean-components/revision-review-components/ProgramRevisionReview";

const ProgramProposalRevisionPage = () => {
  const params = useParams();
  const id = Number(params.id);

  return (
    <div>
      <ProgramRevisionReview proposalId={id} />
    </div>
  );
};

export default ProgramProposalRevisionPage;
