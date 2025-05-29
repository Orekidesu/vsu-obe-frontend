"use client";
import React, { useState } from "react";
import usePrograms from "@/hooks/shared/useProgram";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, X, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";
import ArchivedProgramCard from "@/components/commons/card/ArchivedProgramCard";

const ArchivedProgramsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { session } = useAuth();
  const departmentId = (session as Session)?.Department?.id;

  const {
    programs,
    isLoading: isProgramsLoading,
    error: programsError,
  } = usePrograms();

  // Filter for archived programs belonging to the user's department
  const archivedPrograms =
    programs?.filter(
      (program) =>
        program.status === "archived" && program.department.id === departmentId
    ) || [];

  // Apply search filter
  const filteredPrograms = archivedPrograms.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.department.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (programsError) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Error loading data
        </h2>
        <p className="mt-2 text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <Archive className="h-8 w-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold">Archived Programs</h1>
            <p className="text-gray-600 mt-1">
              Previously active programs that have been archived
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search archived programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Total Archived Programs
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {archivedPrograms.length}
            </p>
          </div>
          <Archive className="h-12 w-12 text-gray-400" />
        </div>
      </div>

      {isProgramsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-64" />
          ))}
        </div>
      ) : (
        <>
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-16">
              <Archive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">
                {archivedPrograms.length === 0
                  ? "No archived programs found"
                  : "No programs match your search"}
              </h2>
              <p className="mt-2 text-gray-600">
                {archivedPrograms.length === 0
                  ? "When programs are archived, they'll appear here."
                  : "Try adjusting your search criteria"}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              {searchQuery && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    Showing {filteredPrograms.length} of{" "}
                    {archivedPrograms.length} archived programs matching &quot;
                    {searchQuery}&quot;
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((program) => (
                  <ArchivedProgramCard key={program.id} program={program} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ArchivedProgramsPage;
