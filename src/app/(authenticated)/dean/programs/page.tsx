"use client";
import React, { useState } from "react";
import usePrograms from "@/hooks/shared/useProgram";
import ProgramCard from "@/components/commons/card/ProgramCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProgramsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { programs, isLoading, error } = usePrograms({ role: "dean" });

  // Filter for active programs
  const activePrograms =
    programs?.filter((program) => program.status === "active") || [];

  // Apply search filter
  const filteredPrograms = activePrograms.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.department.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (id: number) => {
    router.push(`/dean/programs/${id}`);
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Error loading programs
        </h2>
        <p className="mt-2 text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <h1 className="text-3xl font-bold">Active Programs</h1>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search programs..."
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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-64" />
          ))}
        </div>
      ) : (
        <>
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-gray-800">
                {activePrograms.length === 0
                  ? "No active programs found"
                  : "No programs match your search"}
              </h2>
              <p className="mt-2 text-gray-600">
                {activePrograms.length === 0
                  ? "When programs are approved, they'll appear here."
                  : "Try adjusting your search criteria"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  status="active"
                  onViewDetails={(id) => handleViewDetails(id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProgramsPage;
