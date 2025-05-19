"use client";

import { RevisionWizard } from "@/components/department-components/revise-proposal/wizard-revision";

export default function RevisionPage({
  params,
}: {
  params: { proposalId: string };
}) {
  return <RevisionWizard proposalId={params.proposalId} />;
}
