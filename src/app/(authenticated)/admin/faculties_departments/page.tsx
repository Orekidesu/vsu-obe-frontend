"use client";
import React, { useState } from "react";
import useFaculties from "@/hooks/admin/useFaculty";
import useDepartments from "@/hooks/admin/useDepartment";
import CustomSection from "@/components/section/CustomSection";

const FacultiesDepartmentsPage = () => {
  const { faculties, getFaculties } = useFaculties();
  const { departments, getDepartments } = useDepartments();

  return (
    <div className=" grid md:grid-cols-2 grid-cols-1 gap-6 h-[500px]">
      {/* FACULTY SECTION */}
      <CustomSection
        title="Faculties"
        sections={faculties?.data || []}
        fetchSections={getFaculties}
      />

      {/* DEPARTMENT SECTION */}
      <CustomSection
        title="Departments"
        sections={departments?.data || []}
        fetchSections={getDepartments}
      />
    </div>
  );
};

export default FacultiesDepartmentsPage;
