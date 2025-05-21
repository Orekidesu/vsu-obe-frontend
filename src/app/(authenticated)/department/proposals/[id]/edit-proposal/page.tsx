"use client";

import { RevisionWizard } from "@/components/department-components/revise-proposal/WizardRevision";
import { useParams } from "next/navigation";

export default function RevisionPage() {
  const params = useParams();
  const proposalId = params.id as string;

  return <RevisionWizard proposalId={proposalId} />;
}
