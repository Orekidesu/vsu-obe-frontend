"use client";

import { ProgramRevisionWizard } from "@/components/department-components/revise-proposal/WizardProgramRevision";
import { useParams } from "next/navigation";

export default function RevisionPage() {
  const params = useParams();
  const proposalId = params.id as string;

  return <ProgramRevisionWizard proposalId={proposalId} />;
}
