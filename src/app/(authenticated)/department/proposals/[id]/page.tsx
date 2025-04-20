"use client";
import { useParams } from "next/navigation";

export default function ProposalDetailsPage() {
  const params = useParams();
  const proposalId = params.id;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Proposal Details</h1>
      <div className="p-6 border rounded-lg bg-white">
        <p className="text-lg">Proposal ID: {proposalId}</p>
        <p className="text-gray-500 mt-2">
          This is a test page for proposal details (pending or revision).
        </p>
      </div>
    </div>
  );
}
