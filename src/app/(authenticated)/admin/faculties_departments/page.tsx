"use client";
import React, { useState } from "react";
import useFaculties from "@/hooks/admin/useFaculty";
import useDepartments from "@/hooks/admin/useDepartment";
import CustomSection from "@/components/section/CustomSection";
import FacultyForm from "@/components/form/FacultyForm";
import { Faculty } from "@/types/model/Faculty";
import { useToast } from "@/hooks/use-toast";

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

  const { toast } = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateFaculty = async (data: Partial<Faculty>) => {
    return new Promise<void>((resolve, reject) => {
      createFaculty.mutate(data, {
        onError: (error: any) => {
          setFormError(error.message);
          reject(new Error(error.response.data.message));
        },
        onSuccess: () => {
          setFormError(null);
          resolve();
        },
      });
    });
  };

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
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
            error={formError}
          />
        }
      />
    </div>
  );
};

export default FacultiesDepartmentsPage;
