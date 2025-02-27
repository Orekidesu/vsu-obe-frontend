"use client";
import React, { useState, useEffect } from "react";
import useFaculties from "@/hooks/admin/useFaculty";
import useDepartments from "@/hooks/admin/useDepartment";
import FacultyForm from "@/components/form/FacultyForm";
import { Faculty } from "@/types/model/Faculty";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import CustomSelect from "@/components/select/CustomSelect";
import CustomDropdown from "@/components/dropdown/CustomDropdown";
import CustomDialog from "@/components/Dialog/CustomDialog";
import { useToast } from "@/hooks/use-toast";
import {
  handleCreateFaculty,
  handleDeleteFaculty,
  handleUpdateFaculty,
} from "@/app/utils/admin/handleFaculty";

const FacultiesDepartmentsPage = () => {
  const {
    faculties,
    isLoading: isFacultyLoading,
    error: facultiesError,
    createFaculty,
    updateFaculty,
    deleteFaculty,
  } = useFaculties();

  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (faculties && faculties.length > 0) {
      setSelectedFaculty(faculties[0]);
    }
  }, [faculties]);

  const handleCreate = async (data: Partial<Faculty>) => {
    await handleCreateFaculty(createFaculty, data, setFormError);
  };

  const handleUpdate = async (data: Partial<Faculty>) => {
    await handleUpdateFaculty(updateFaculty, data, setFormError);
  };

  const handleDelete = (id: number) => {
    handleDeleteFaculty(deleteFaculty, id);
  };

  const handleEdit = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
  };
  const filteredFaculties = faculties
    ?.filter(
      (faculty) =>
        faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  return (
    <div className="space-y-4 flex flex-col h-[500px]">
      <div className="flex flex-col border rounded-md gap-2 px-2 pb-2">
        <h2 className="text-lg font-medium pt-2">Faculties</h2>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Faculties"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <CustomSelect
            defaultValue="asc"
            options={[
              { value: "asc", label: "A - Z" },
              { value: "desc", label: "Z - A" },
            ]}
            onChange={handleSortOrderChange}
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
                      onClick: () => handleEdit(faculty),
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 className="h-4 w-4 mr-2 text-red-500" />,
                      onClick: () => handleDelete(faculty.id),
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
        title={`${isEditMode ? "Edit" : "Add"} Faculty`}
        description={`${isEditMode ? "Edit" : "Add"} Faculty`}
        footerButtonTitle="Save"
        isOpen={isDialogOpen}
        setIsOpen={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) setIsEditMode(false);
        }}
        buttonIcon={<Plus />}
      >
        <FacultyForm
          onSubmit={isEditMode ? handleUpdate : handleCreate}
          isLoading={isFacultyLoading}
          setIsOpen={setIsDialogOpen}
          error={formError}
          initialData={isEditMode ? selectedFaculty || undefined : undefined}
        />
      </CustomDialog>
    </div>
  );
};

export default FacultiesDepartmentsPage;
