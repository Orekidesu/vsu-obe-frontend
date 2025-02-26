// import React from "react";

// const page = () => {
//   return <div>This is the user management page</div>;
// };

// export default page;
"use client";
import FacultyForm from "@/components/form/FacultyForm";
import useFaculties from "@/hooks/admin/useFaculty";
import { Faculty } from "@/types/model/Faculty";
import { useEffect } from "react";

const FacultyPage = () => {
  const { faculties, isLoading, createFaculty } = useFaculties();

  useEffect(() => {
    console.log("Faculties updated:", faculties);
  }, [faculties]);

  const handleCreateFaculty = (data: Partial<Faculty>) => {
    createFaculty.mutate(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Faculty Management</h1>

      {/* Faculty Form */}
      <div className="mt-6">
        <h2 className="text-lg font-medium">Add New Faculty</h2>
        <FacultyForm
          onSubmit={handleCreateFaculty}
          isLoading={createFaculty.isPending}
        />
      </div>

      {/* Faculty List */}
      <div className="mt-6">
        <h2 className="text-lg font-medium">Existing Faculties</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {faculties?.map((faculty:any) => (
              <li key={faculty.id} className="border p-3 rounded shadow-sm">
                <p>
                  <strong>{faculty.name}</strong>
                </p>
                <p>{faculty.department}</p>
                <p className="text-gray-500">{faculty.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FacultyPage;
