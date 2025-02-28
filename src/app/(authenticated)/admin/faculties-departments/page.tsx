"use client";
import React, { useState, useEffect, use } from "react";
import useFaculties from "@/hooks/admin/useFaculty";
import useDepartments from "@/hooks/admin/useDepartment";
import FacultyForm from "@/components/form/FacultyForm";
import DepartmentForm from "@/components/form/DepartmentForm";
import { Faculty } from "@/types/model/Faculty";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui";
import CustomSelect from "@/components/select/CustomSelect";
import CustomDropdown from "@/components/dropdown/CustomDropdown";
import CustomDialog from "@/components/Dialog/CustomDialog";
import {
  createFacultyHandler,
  deleteFacultyHandler,
  updateFacultyHandler,
} from "@/app/utils/admin/handleFaculty";
import { Department } from "@/types/model/Department";
import {
  createDepartmentHandler,
  updateDepartmentHandler,
} from "@/app/utils/admin/handleDepartment";

const FacultiesDepartmentsPage = () => {
  const {
    faculties,
    isLoading: isFacultyLoading,
    error: facultiesError,
    createFaculty,
    updateFaculty,
    deleteFaculty,
  } = useFaculties();

  const {
    departments,
    isLoading: isDepartmentLoading,
    error: departmentError,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments();

  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isFacultyDialogOpen, setIsFacultyDialogOpen] = useState(false);
  const [isFacultyEditMode, setIsFacultyEditMode] = useState(false);
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isDepartmentEditMode, setIsDepartmentEditMode] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchFacultyQuery, setSearchFacultyQuery] = useState("");
  const [sortOrderFaculties, setSortOrderFaculties] = useState("asc");

  const [searchDepartmentQuery, setSearchDepartmentQuery] = useState("");
  const [sortOrderDepartments, setSortOrderDepartments] = useState("asc");

  useEffect(() => {
    if (faculties && faculties.length > 0) {
      setSelectedFaculty(faculties[0]);
    }
  }, [faculties]);

  // ============================= FACULTIES ===========================//
  const handleCreateFaculty = async (data: Partial<Faculty>) => {
    console.log("entered here! create");
    await createFacultyHandler(createFaculty, data, setFormError);
  };

  const handleUpdateFaculty = async (data: Partial<Faculty>) => {
    console.log("entered here! update");
    await updateFacultyHandler(updateFaculty, data, setFormError);
    setIsFacultyEditMode(false);
  };

  const handleDeleteFaculty = (id: number) => {
    deleteFacultyHandler(deleteFaculty, id);
  };

  const handleEditFaculty = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsFacultyEditMode(true);
    setIsFacultyDialogOpen(true);
  };

  const handleSortOrderFaculties = (value: string) => {
    setSortOrderFaculties(value);
  };
  const filteredFaculties = faculties
    ?.filter(
      (faculty) =>
        faculty.name.toLowerCase().includes(searchFacultyQuery.toLowerCase()) ||
        faculty.abbreviation
          .toLowerCase()
          .includes(searchFacultyQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrderFaculties === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  // ============================= END FACULTIES ===========================//

  // ============================= DEPARTMENTS ===========================//

  const handleCreateDepartment = async (data: Partial<Department>) => {
    console.log("nisulod ari");
    await createDepartmentHandler(createDepartment, data, setFormError);
    console.log("successful");
  };

  const handleUpdateDepartment = async (data: Partial<Department>) => {
    setIsDepartmentEditMode(false);
    await updateDepartmentHandler(updateDepartment, data, setFormError);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsDepartmentEditMode(true);
    setIsDepartmentDialogOpen(true);
  };

  const handleSortOrderDepartments = (value: string) => {
    setSortOrderDepartments(value);
  };

  const filteredDepartments = departments
    ?.filter(
      (department) =>
        department.name
          .toLowerCase()
          .includes(searchDepartmentQuery.toLowerCase()) ||
        department.abbreviation
          .toLowerCase()
          .includes(searchDepartmentQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrderDepartments == "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  // ============================= END DEPARTMENTS ===========================//
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {/* Faculties Section */}
      <div className="space-y-4 flex flex-col h-[500px]">
        <div className="flex flex-col border rounded-md gap-2 px-2 pb-2">
          <h2 className="text-lg font-medium pt-2">Faculties</h2>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Faculties"
                className="pl-8"
                value={searchFacultyQuery}
                onChange={(e) => setSearchFacultyQuery(e.target.value)}
              />
            </div>

            <CustomSelect
              defaultValue="asc"
              options={[
                { value: "asc", label: "A - Z" },
                { value: "desc", label: "Z - A" },
              ]}
              onChange={handleSortOrderFaculties}
            />
          </div>
        </div>
        <div className="border rounded-md flex flex-col flex-1 overflow-auto">
          <div className="flex-1">
            {filteredFaculties?.map((faculty: any) => (
              <div
                key={faculty.id}
                className={`flex items-center justify-between p-3 hover:bg-muted/70 ${
                  selectedFaculty?.id === faculty.id ? "bg-primary/10" : ""
                }`}
                onClick={() => setSelectedFaculty(faculty)}
              >
                <span>
                  {faculty.name} ({faculty.abbreviation}){" "}
                </span>

                {selectedFaculty === faculty && (
                  <CustomDropdown
                    actions={[
                      {
                        label: "Edit",
                        icon: <Pencil className="h-4 w-4 mr-2" />,
                        onClick: () => handleEditFaculty(faculty),
                      },
                      {
                        label: "Delete",
                        icon: <Trash2 className="h-4 w-4 mr-2 text-red-500" />,
                        onClick: () => handleDeleteFaculty(faculty.id),
                      },
                    ]}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <CustomDialog
          buttonTitle="Add Faculty"
          title={`${isFacultyEditMode ? "Edit" : "Add"} Faculty`}
          description={`${isFacultyEditMode ? "Edit" : "Add"} Faculty`}
          footerButtonTitle="Save"
          isOpen={isFacultyDialogOpen}
          setIsOpen={(isOpen) => {
            setIsFacultyDialogOpen(isOpen);
            if (!isOpen) setIsFacultyEditMode(false);
          }}
          buttonIcon={<Plus />}
        >
          <FacultyForm
            onSubmit={
              isFacultyEditMode ? handleUpdateFaculty : handleCreateFaculty
            }
            setIsOpen={setIsFacultyDialogOpen}
            error={formError}
            initialData={
              isFacultyEditMode ? selectedFaculty || undefined : undefined
            }
          />
        </CustomDialog>
      </div>

      {/* Departments Section */}
      <div className="space-y-4 flex flex-col h-[500px]">
        <div className="flex flex-col border rounded-md gap-2 px-2 pb-2">
          <h2 className="text-lg font-medium pt-2">Departments</h2>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Departments"
                className="pl-8"
                value={searchDepartmentQuery}
                onChange={(e) => setSearchDepartmentQuery(e.target.value)}
              />
            </div>

            <CustomSelect
              defaultValue="asc"
              options={[
                { value: "asc", label: "A - Z" },
                { value: "desc", label: "Z - A" },
              ]}
              onChange={handleSortOrderDepartments}
            />
          </div>
        </div>
        <div className="border rounded-md flex flex-col flex-1 overflow-auto">
          <div className="flex-1">
            {filteredDepartments?.map((department: any) => (
              <div
                key={department.id}
                className={`flex items-center justify-between p-3 hover:bg-muted/70 ${
                  selectedDepartment?.id === department.id
                    ? "bg-primary/10"
                    : ""
                }`}
                onClick={() => setSelectedDepartment(department)}
              >
                <span>
                  {department.name} ({department.abbreviation}){" "}
                </span>

                {selectedDepartment === department && (
                  // <CustomDropdown
                  //   actions={[
                  //     {
                  //       label: "Edit",
                  //       icon: <Pencil className="h-4 w-4 mr-2" />,
                  //       onClick: () => handleEdit(department),
                  //     },
                  //     {
                  //       label: "Delete",
                  //       icon: <Trash2 className="h-4 w-4 mr-2 text-red-500" />,
                  //       onClick: () => handleDeleteFaculty(department.id),
                  //     },
                  //   ]}
                  // />
                  <></>
                )}
              </div>
            ))}
          </div>
        </div>
        <CustomDialog
          buttonTitle="Add Department"
          title={`${isDepartmentEditMode ? "Edit" : "Add"} Department`}
          description={`${isDepartmentEditMode ? "Edit" : "Add"} Department`}
          footerButtonTitle="Save"
          isOpen={isDepartmentDialogOpen}
          setIsOpen={(isOpen) => {
            setIsDepartmentDialogOpen(isOpen);
            if (!isOpen) setIsDepartmentEditMode(false);
          }}
          buttonIcon={<Plus />}
        >
          <DepartmentForm
            onSubmit={
              isDepartmentEditMode
                ? handleUpdateDepartment
                : handleCreateDepartment
            }
            setIsOpen={setIsDepartmentDialogOpen}
            error={formError}
            initialData={
              isDepartmentEditMode ? selectedDepartment || undefined : undefined
            }
          />
        </CustomDialog>
      </div>
    </div>
  );
};

export default FacultiesDepartmentsPage;
