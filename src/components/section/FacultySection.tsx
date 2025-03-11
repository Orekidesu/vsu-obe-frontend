"use client";
import React, { useState, useEffect } from "react";
import useFaculties from "@/hooks/admin/useFaculty";
import FacultyForm from "@/components/admin-components/form/FacultyForm";
import { Faculty } from "@/types/model/Faculty";
import { Search, Plus, Pencil, Trash2, FileSearch2 } from "lucide-react";
import { Input } from "@/components/ui";
import CustomSelect from "@/components/commons/select/CustomSelect";
import CustomDropdown from "@/components/commons/dropdown/CustomDropdown";
import CustomDialog from "@/components/commons/dialog/CustomDialog";
import {
  createFacultyHandler,
  deleteFacultyHandler,
  updateFacultyHandler,
} from "@/app/utils/admin/handleFaculty";

type FacultySectionProps = {
  onSelectFaculty: (facultyId: number) => void;
};

const FacultySection: React.FC<FacultySectionProps> = ({ onSelectFaculty }) => {
  const {
    faculties,
    isLoading: isFacultyLoading,
    error: facultiesError,
    createFaculty,
    updateFaculty,
    deleteFaculty,
  } = useFaculties();

  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [isFacultyDialogOpen, setIsFacultyDialogOpen] = useState(false);
  const [isFacultyEditMode, setIsFacultyEditMode] = useState(false);
  const [isFacultyDetailsDialogOpen, setIsFacultyDetailsDialogOpen] =
    useState<boolean>(false);
  const [formError, setFormError] = useState<
    Record<string, string[]> | string | null
  >(null);
  const [searchFacultyQuery, setSearchFacultyQuery] = useState("");
  const [sortOrderFaculties, setSortOrderFaculties] = useState("asc");

  useEffect(() => {
    if (faculties && faculties.length > 0) {
      const sortedFaculties = [...faculties].sort((a, b) => {
        if (sortOrderFaculties === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
      setSelectedFaculty(sortedFaculties[0]);
      onSelectFaculty(sortedFaculties[0].id);
    }
  }, []);

  const handleCreateFaculty = async (data: Partial<Faculty>) => {
    await createFacultyHandler(createFaculty, data, setFormError);
  };

  const handleUpdateFaculty = async (data: Partial<Faculty>) => {
    await updateFacultyHandler(updateFaculty, data, setFormError);
    setIsFacultyEditMode(false);
  };

  //View faculty detail
  const handleViewFacultyDetails = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsFacultyDetailsDialogOpen(true);
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
              value={searchFacultyQuery}
              onChange={(e) => setSearchFacultyQuery(e.target.value)}
            />
          </div>

          <div>
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
      </div>
      <div className="border rounded-md flex flex-col flex-1 overflow-auto">
        <div className="flex-1">
          {filteredFaculties?.map((faculty: any) => (
            <div
              key={faculty.id}
              className={`flex items-center justify-between p-3 hover:bg-muted/70 ${
                selectedFaculty?.id === faculty.id ? "bg-primary/10" : ""
              }`}
              onClick={() => {
                setSelectedFaculty(faculty);
                onSelectFaculty(faculty.id);
              }}
            >
              <span>
                {faculty.name} ({faculty.abbreviation}){" "}
              </span>

              {selectedFaculty?.id === faculty.id && (
                <CustomDropdown
                  actions={[
                    {
                      label: "Edit",
                      icon: <Pencil className="h-4 w-4 mr-2" />,
                      onClick: () => handleEditFaculty(faculty),
                    },
                    {
                      label: "Details",
                      icon: <FileSearch2 className="h-4 w-4 mr-2 " />,
                      onClick: () => handleViewFacultyDetails(faculty),
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
      {/* Custom Dialog For Adding/Editting Faculty */}
      <CustomDialog
        buttonTitle="Add Faculty"
        title={`${isFacultyEditMode ? "Edit" : "Add"} Faculty`}
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

      <CustomDialog
        title={`Faculty Details`}
        footerButtonTitle="Close"
        isOpen={isFacultyDetailsDialogOpen}
        setIsOpen={setIsFacultyDetailsDialogOpen}
      >
        {selectedFaculty && (
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-semibold">Name: </span>{" "}
              {selectedFaculty.name}
            </p>
            <p>
              <span className="font-semibold">Abbreviation: </span>
              {selectedFaculty.abbreviation}
            </p>
            <p>
              <span className="font-semibold">No. of Departments: </span>
              {selectedFaculty.departments.length}
            </p>
          </div>
        )}
      </CustomDialog>
    </div>
  );
};

export default FacultySection;
