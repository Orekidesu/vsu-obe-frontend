"use client";
import React from "react";
import useFaculties from "@/hooks/admin/useFaculty";
import useDepartments from "@/hooks/admin/useDepartment";
import CustomSection from "@/components/section/CustomSection";
import FacultyForm from "@/components/form/FacultyForm";
import { Faculty } from "@/types/model/Faculty";

const FacultiesDepartmentsPage = () => {
  const {
    faculties,
    isLoading: isFacultyLoading,
    error: facultiesError,
    createFaculty,
  } = useFaculties();

  const {
    departments,
    isLoading: isDepartmentLoading,
    error: departmentError,
    createDepartment,
  } = useDepartments();

  const handleCreateFaculty = (data: Partial<Faculty>) => {
    createFaculty.mutate(data);
  };

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-6 h-[500px]">
      <CustomSection
        title="Faculties"
        sections={faculties || []}
        isLoading={isFacultyLoading}
        error={facultiesError}
        formComponent={
          <FacultyForm
            onSubmit={handleCreateFaculty}
            isLoading={isFacultyLoading}
            setIsOpen={() => {}}
          />
        }
      />
    </div>
  );
};

export default FacultiesDepartmentsPage;
