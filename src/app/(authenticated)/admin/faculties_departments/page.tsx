"use client";
import React from "react";
import useFaculties from "@/hooks/admin/useFaculty";
import useDepartments from "@/hooks/admin/useDepartment";
import CustomSection from "@/components/section/CustomSection";

const FacultiesDepartmentsPage = () => {
  const {
    faculties,
    isLoading: facultiesLoading,
    error: facultiesError,
  } = useFaculties();

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-6 h-[500px]">
      {/* FACULTY SECTION */}
      <CustomSection
        title="Faculties"
        sections={faculties || []}
        isLoading={facultiesLoading}
        error={facultiesError}
      />
    </div>
  );
};

export default FacultiesDepartmentsPage;
