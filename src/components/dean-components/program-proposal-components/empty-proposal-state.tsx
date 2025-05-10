"use client";
import { LightbulbIcon } from "lucide-react";

type EmptyProposalStateProps = {
  hasFilters: boolean;
  message?: string;
};

export function EmptyProposalState({
  hasFilters,
  message,
}: EmptyProposalStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-gray-50">
      <LightbulbIcon className="h-12 w-12 text-gray-400 mb-4" />
      {message ? (
        <p className="text-gray-500">{message}</p>
      ) : (
        <p className="text-gray-500">
          {hasFilters
            ? "No proposals match your filters"
            : "No program proposals found"}
        </p>
      )}
    </div>
  );
}
