"use client";
import { useParams } from "next/navigation";

export default function EditProposalPage() {
  const params = useParams();
  const proposalId = params.id;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Proposal</h1>
      <div className="p-6 border rounded-lg bg-white">
        <p className="text-lg">Editing Proposal ID: {proposalId}</p>
        <p className="text-gray-500 mt-2">
          This is a test page for editing proposals (primarily those in revision
          status).
        </p>
      </div>
    </div>
  );
}
