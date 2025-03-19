"use client";
import React, { useState } from "react";
import useDepartments from "@/hooks/admin/useDepartment";
import DepartmentForm from "@/components/admin-components/form/DepartmentForm";
import { Department } from "@/types/model/Department";
import { Search, Plus, Pencil, Trash2, FileSearch2 } from "lucide-react";
import { Input } from "@/components/ui";
import CustomSelect from "@/components/commons/select/CustomSelect";
import CustomDropdown from "@/components/commons/dropdown/CustomDropdown";
import CustomDialog from "@/components/commons/dialog/CustomDialog";
import { CustomAlertDialog } from "../commons/alert-dialog/CustomAlertDialog";
import {
  createDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
} from "@/app/utils/admin/handleDepartment";

type DepartmentSectionProps = {
  selectedFacultyId: number;
};

const DepartmentSection: React.FC<DepartmentSectionProps> = ({
  selectedFacultyId,
}) => {
  const { departments, createDepartment, updateDepartment, deleteDepartment } =
    useDepartments();

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isDepartmentEditMode, setIsDepartmentEditMode] = useState(false);
  const [formError, setFormError] = useState<
    Record<string, string[]> | string | null
  >(null);
  const [searchDepartmentQuery, setSearchDepartmentQuery] = useState("");
  const [sortOrderDepartments, setSortOrderDepartments] = useState("asc");

  // Dialog for deleting
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);

  const [isDepartmentDetailsDialogOpen, setIsDepartmentDetailsDialogOpen] =
    useState<boolean>(false);
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleCreateDepartment = async (data: Partial<Department>) => {
    await createDepartmentHandler(createDepartment, data, setFormError);
  };

  const handleUpdateDepartment = async (data: Partial<Department>) => {
    await updateDepartmentHandler(updateDepartment, data, setFormError);
    setIsDepartmentEditMode(false);
  };
  const handleViewDepartmentDetails = (department: Department) => {
    setSelectedDepartment(department);
    setIsDepartmentDetailsDialogOpen(true);
  };

  const confirmDeleteDepartment = (department: Department) => {
    setDepartmentToDelete(department);
    setIsAlertDialogOpen(true);
  };

  const handleDeleteDepartment = async (id: number) => {
    try {
      setIsDeleting(true);
      deleteDepartmentHandler(deleteDepartment, id);
      setIsAlertDialogOpen(false);
      setDepartmentToDelete(null);
      setIsDeleting(false);
    } catch (error) {
      console.error("Deletion failed:", error);
    }
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
        department.faculty.id === selectedFacultyId &&
        (department.name
          .toLowerCase()
          .includes(searchDepartmentQuery.toLowerCase()) ||
          department.abbreviation
            .toLowerCase()
            .includes(searchDepartmentQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrderDepartments == "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  return (
    <div className="space-y-4 flex flex-col h-[500px]">
      <div className="flex flex-col border rounded-md gap-2 px-2 pb-2">
        <h2 className="text-lg font-medium pt-2">Departments</h2>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
            <Input
              placeholder="Search Departments"
              className="pl-8"
              value={searchDepartmentQuery}
              onChange={(e) => setSearchDepartmentQuery(e.target.value)}
            />
          </div>

          <div>
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
      </div>
      <div className="border rounded-md flex flex-col flex-1 overflow-auto">
        <div className="flex-1">
          {filteredDepartments?.map((department: Department) => (
            <div
              key={department.id}
              className={`flex items-center justify-between p-3 hover:bg-muted/70 ${
                selectedDepartment?.id === department.id ? "bg-primary/10" : ""
              }`}
              onClick={() => setSelectedDepartment(department)}
            >
              <span>
                {department.name} ({department.abbreviation}){" "}
              </span>

              {selectedDepartment === department && (
                <CustomDropdown
                  actions={[
                    {
                      label: "Edit",
                      icon: <Pencil className="h-4 w-4 mr-2" />,
                      onClick: () => handleEditDepartment(department),
                    },
                    {
                      label: "Details",
                      icon: <FileSearch2 className="h-4 w-4 mr-2 " />,
                      onClick: () => handleViewDepartmentDetails(department),
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 className="h-4 w-4 mr-2 text-red-500" />,
                      onClick: () => confirmDeleteDepartment(department),
                    },
                  ]}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <CustomDialog
        buttonTitle="Add Department"
        title={`${isDepartmentEditMode ? "Edit" : "Add"} Department`}
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
      {/* Custom Alert Dialog for deleting faculty */}
      <CustomAlertDialog
        title="Delete Department"
        description="Are you sure you want to delete this department? All data associated with this department including users will also be deleted. This action cannot be undone."
        actionText="Delete"
        actionVariant="destructive"
        isLoading={isDeleting} // Pass state from UserTable
        onAction={() =>
          departmentToDelete && handleDeleteDepartment(departmentToDelete.id)
        }
        onCancel={() => setIsAlertDialogOpen(false)}
        open={isAlertDialogOpen}
        onOpenChangeAction={setIsAlertDialogOpen}
      />
      {/* Custom dialog for faculty details */}
      <CustomDialog
        title={`Department Details`}
        footerButtonTitle="Close"
        isOpen={isDepartmentDetailsDialogOpen}
        setIsOpen={setIsDepartmentDetailsDialogOpen}
      >
        {selectedDepartment && (
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-semibold">Name: </span>{" "}
              {selectedDepartment.name}
            </p>
            <p>
              <span className="font-semibold">Abbreviation: </span>
              {selectedDepartment.abbreviation}
            </p>

            <p>
              <span className="font-semibold">No. of Programs: </span>
              5(static)
            </p>
          </div>
        )}
      </CustomDialog>
    </div>
  );
};

export default DepartmentSection;
