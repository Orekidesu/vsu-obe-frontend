"use client";
import React from "react";
import FacultiesSection from "@/components/section/FacultySection";
import DepartmentsSection from "@/components/section/DepartmentSection";

const FacultiesDepartmentsPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <FacultiesSection />
      <DepartmentsSection />
    </div>
  );
};

export default FacultiesDepartmentsPage;
