"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Archive } from "lucide-react";

const ArchivedProgramDetailsPage = () => {
  const params = useParams();
  const programId = params.id;

  return (
    <div className="container mx-auto py-8">
      <div className="text-center space-y-4">
        <Archive className="h-16 w-16 text-gray-400 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800">
          Archived Program Details
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Details for archived programs are not available for viewing. Program
          ID: {programId} has been archived and is no longer accessible.
        </p>
      </div>
    </div>
  );
};

export default ArchivedProgramDetailsPage;
