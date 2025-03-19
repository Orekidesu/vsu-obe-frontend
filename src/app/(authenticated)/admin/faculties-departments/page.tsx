"use client";
import React, { useCallback, useState } from "react";
import FacultySection from "@/components/section/FacultySection";
import DepartmentSection from "@/components/section/DepartmentSection";

const FacultiesDepartmentsPage = () => {
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );

  const handleSelectFaculty = useCallback((facultyId: number) => {
    setSelectedFacultyId(facultyId);
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <FacultySection onSelectFaculty={handleSelectFaculty} />
      {selectedFacultyId !== null ? (
        <DepartmentSection selectedFacultyId={selectedFacultyId} />
      ) : (
        <div className="flex justify-center items-center h-full">
          Select a Department
        </div>
      )}
    </div>
  );
};

export default FacultiesDepartmentsPage;
